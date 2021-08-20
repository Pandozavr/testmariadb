CREATE TABLE mern.`user` (
	user_id INT auto_increment NOT NULL,
	email varchar(100) NOT NULL,
	password varchar(100) NOT NULL,
	CONSTRAINT user_pk PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb3
COLLATE=utf8mb3_general_ci;

////////////////////////////////////

CREATE TABLE mern.`user_token` (
  `user_id` int(11) NOT NULL,
  `refresh_token` varchar(100) NOT NULL,
  KEY `user_token_FK` (`user_id`),
  CONSTRAINT `user_token_FK` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3

//////////////////////////////////////

CREATE TABLE mern.user_avatar (
	file_name varchar(100) NOT NULL,
	user_id INT NOT NULL,
	CONSTRAINT user_avatar_FK FOREIGN KEY (user_id) REFERENCES mern.`user`(user_id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb3
COLLATE=utf8mb3_general_ci;

//////////////////////////////////////

CREATE TABLE mern.user_post (
	user_id INT NOT NULL,
	post_id INT auto_increment NOT NULL,
	post_text MEDIUMTEXT NOT NULL
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb3
COLLATE=utf8mb3_general_ci;

