CREATE DATABASE listener;

\c listener;

CREATE TABLE user(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(12) NOT NULL,
    favorite_gender VARCHAR(30) NOT NULL,
    favorite_song VARCHAR(30) NOT NULL,
    born_date DATE NOT NULL,
    country VARCHAR(30) NOT NULL,
    picture VARCHAR(255)
);

CREATE TABLE friends(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    picture VARCHAR(255),
    is_favorite BOOLEAN NOT NULL,
    user_id INT,
    FOREIGN KEY(user_id) REFERENCES user(id)
);

CREATE TABLE artists(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    followers INT NOT NULL,
    picture VARCHAR(255),
    is_favorite BOOLEAN NOT NULL,
    user_id INT,
    FOREIGN KEY(user_id) REFERENCES user(id)
);

CREATE TABLE playlists(
    id VARCHAR(30) PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    followers INT NOT NULL,
    owner VARCHAR(50) NOT NULL,
    time VARCHAR(10) NOT NULL,
    picture VARCHAR(255),
    tracks VARCHAR(30),
    user_id INT,
    FOREIGN KEY(user_id) REFERENCES user(id)
);

CREATE TABLE songs(
    id VARCHAR(30) PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    album VARCHAR(30) NOT NULL,
    artists VARCHAR(30) NOT NULL,
    time VARCHAR(10) NOT NULL,
    release_date VARCHAR(10) NOT NULL,
    picture VARCHAR(255),
    gender VARCHAR(30) NOT NULL,
    is_favorite BOOLEAN NOT NULL,
    user_id INT,
    FOREIGN KEY(user_id) REFERENCES user(id)
);
