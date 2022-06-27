CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `user_name` varchar(100) NOT NULL,
  `isFriend` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb3

////////////////////////////////////

CREATE TABLE `user_token` (
  `user_id` int(11) NOT NULL,
  `refresh_token` mediumtext NOT NULL,
  KEY `user_token_FK` (`user_id`),
  CONSTRAINT `user_token_FK` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3

//////////////////////////////////////

CREATE TABLE `user_avatar` (
  `file_name` varchar(100) NOT NULL,
  `user_id` int(11) NOT NULL,
  KEY `user_avatar_FK` (`user_id`),
  CONSTRAINT `user_avatar_FK` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3

//////////////////////////////////////

CREATE TABLE `user_post` (
  `user_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL AUTO_INCREMENT,
  `post_text` mediumtext NOT NULL,
  PRIMARY KEY (`post_id`),
  KEY `user_post_FK` (`user_id`),
  CONSTRAINT `user_post_FK` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb3

//////////////////////////////////////

CREATE TABLE `user_friend` (
  `user_id` int(11) NOT NULL,
  `user_friend_id` int(11) NOT NULL,
  KEY `user_friend_FK` (`user_id`),
  CONSTRAINT `user_friend_FK` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3

//////////////////////////////////////

CREATE TABLE `music` (
  `track_id` int(11) NOT NULL AUTO_INCREMENT,
  `track_name` varchar(100) NOT NULL,
  `artist` varchar(100) NOT NULL,
  `file_name` varchar(100) NOT NULL,
  PRIMARY KEY (`track_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3