package main

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

var pool *pgxpool.Pool

func initDatabase() error {
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		databaseURL = "postgres://user:password@localhost:5432/authdb"
	}

	var err error
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	pool, err = pgxpool.New(ctx, databaseURL)
	if err != nil {
		return fmt.Errorf("unable to create connection pool: %w", err)
	}

	if err := pool.Ping(ctx); err != nil {
		return fmt.Errorf("unable to ping database: %w", err)
	}

	if err := createUsersTable(ctx); err != nil {
		return fmt.Errorf("unable to create users table: %w", err)
	}

	return nil
}

func createUsersTable(ctx context.Context) error {
	query := `
		CREATE TABLE IF NOT EXISTS users (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			email VARCHAR(255) UNIQUE NOT NULL,
			password_hash VARCHAR(255) NOT NULL,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
		);

		CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
	`

	_, err := pool.Exec(ctx, query)
	return err
}

func createUser(user User) error {
	ctx := context.Background()
	
	userID, err := uuid.Parse(user.ID)
	if err != nil {
		userID = uuid.New()
		user.ID = userID.String()
	}

	query := `
		INSERT INTO users (id, email, password_hash, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5)
		ON CONFLICT (email) DO NOTHING
	`

	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()

	result, err := pool.Exec(ctx, query, 
		userID, 
		user.Email, 
		user.PasswordHash,
		user.CreatedAt,
		user.UpdatedAt)

	if err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}

	if result.RowsAffected() == 0 {
		return fmt.Errorf("user with email %s already exists", user.Email)
	}

	return nil
}

func getUserByEmail(email string) (User, error) {
	ctx := context.Background()
	
	var user User
	query := `
		SELECT id, email, password_hash, created_at, updated_at
		FROM users
		WHERE email = $1
	`

	err := pool.QueryRow(ctx, query, email).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return User{}, fmt.Errorf("user not found: %w", err)
	}

	return user, nil
}

func getUserByID(userID string) (User, error) {
	ctx := context.Background()
	
	var user User
	query := `
		SELECT id, email, password_hash, created_at, updated_at
		FROM users
		WHERE id = $1
	`

	err := pool.QueryRow(ctx, query, userID).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return User{}, fmt.Errorf("user not found: %w", err)
	}

	return user, nil
}

func closeDatabase() {
	if pool != nil {
		pool.Close()
	}
}