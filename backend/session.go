package main

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Session struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	Token     string    `json:"token"`
	CreatedAt time.Time `json:"created_at"`
	ExpiresAt time.Time `json:"expires_at"`
}

type RefreshToken struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	Token     string    `json:"token"`
	CreatedAt time.Time `json:"created_at"`
	ExpiresAt time.Time `json:"expires_at"`
	IsUsed    bool      `json:"is_used"`
}

var activeSessions = make(map[string]*Session)
var refreshTokens = make(map[string]*RefreshToken)

func generateSessionToken() string {
	bytes := make([]byte, 32)
	rand.Read(bytes)
	return hex.EncodeToString(bytes)
}

func createSession(userID string) (*Session, error) {
	sessionID := uuid.New().String()
	sessionToken := generateSessionToken()
	
	session := &Session{
		ID:        sessionID,
		UserID:    userID,
		Token:     sessionToken,
		CreatedAt: time.Now(),
		ExpiresAt: time.Now().Add(24 * time.Hour),
	}
	
	activeSessions[sessionToken] = session
	return session, nil
}

func getSessionByToken(token string) (*Session, error) {
	session, exists := activeSessions[token]
	if !exists {
		return nil, errors.New("session not found")
	}
	
	if time.Now().After(session.ExpiresAt) {
		delete(activeSessions, token)
		return nil, errors.New("session expired")
	}
	
	return session, nil
}

func deleteSession(token string) error {
	delete(activeSessions, token)
	return nil
}

func generateRefreshToken(userID string) (*RefreshToken, error) {
	tokenID := uuid.New().String()
	refreshToken := generateSessionToken()
	
	token := &RefreshToken{
		ID:        tokenID,
		UserID:    userID,
		Token:     refreshToken,
		CreatedAt: time.Now(),
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour), // 7 days
		IsUsed:    false,
	}
	
	refreshTokens[refreshToken] = token
	return token, nil
}

func getRefreshTokenByToken(token string) (*RefreshToken, error) {
	refreshToken, exists := refreshTokens[token]
	if !exists {
		return nil, errors.New("refresh token not found")
	}
	
	if time.Now().After(refreshToken.ExpiresAt) {
		delete(refreshTokens, token)
		return nil, errors.New("refresh token expired")
	}
	
	if refreshToken.IsUsed {
		return nil, errors.New("refresh token already used")
	}
	
	return refreshToken, nil
}

func useRefreshToken(token string) error {
	refreshToken, exists := refreshTokens[token]
	if !exists {
		return errors.New("refresh token not found")
	}
	
	refreshToken.IsUsed = true
	return nil
}

func setAuthCookie(c *gin.Context, token string) {
	isSecure := gin.Mode() == gin.ReleaseMode
	maxAge := 86400 // 24 hours
	
	c.SetCookie("auth_token", token, maxAge, "/", "", isSecure, true)
	c.SetCookie("token_type", "bearer", maxAge, "/", "", isSecure, false)
}

func clearAuthCookie(c *gin.Context) {
	c.SetCookie("auth_token", "", -1, "/", "", false, true)
	c.SetCookie("token_type", "", -1, "/", "", false, false)
}

func enhancedAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString, err := c.Cookie("auth_token")
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "No authentication token provided",
				"code":  "MISSING_TOKEN",
			})
			c.Abort()
			return
		}

		session, err := getSessionByToken(tokenString)
		if err != nil {
			clearAuthCookie(c)
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid or expired session",
				"code":  "INVALID_SESSION",
			})
			c.Abort()
			return
		}

		claims, err := validateJWT(tokenString)
		if err != nil {
			clearAuthCookie(c)
			deleteSession(tokenString)
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid authentication token",
				"code":  "INVALID_TOKEN",
			})
			c.Abort()
			return
		}

		c.Set("user_id", claims.UserID)
		c.Set("email", claims.Email)
		c.Set("session_id", session.ID)
		c.Next()
	}
}