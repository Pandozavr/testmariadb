CREATE TABLE sys.`user` (
	id INT auto_increment NOT NULL,
	email varchar(100) NOT NULL,
	password varchar(100) NOT NULL,
	created DATETIME DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT user_pk PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb3
COLLATE=utf8mb3_general_ci;