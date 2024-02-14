/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE IF NOT EXISTS `db_cocofyc` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `db_cocofyc`;

CREATE TABLE IF NOT EXISTS `tb_cuotas` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(30) NOT NULL,
  `vencimento` date NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE IF NOT EXISTS `tb_establecimientos` (
  `id` bigint(20) NOT NULL DEFAULT 0,
  `establecimiento` varchar(100) NOT NULL,
  `CUIT` varchar(13) DEFAULT NULL,
  `domicilio` varchar(60) DEFAULT NULL,
  `localidad` varchar(30) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE IF NOT EXISTS `tb_estados_matriculas` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `estado` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT IGNORE INTO `tb_estados_matriculas` (`id`, `estado`) VALUES
	(1, 'Retiró');

CREATE TABLE IF NOT EXISTS `tb_expedientes` (
  `id` bigint(20) NOT NULL DEFAULT 0,
  `profesional_id` bigint(20) NOT NULL,
  `fecha` date NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_tb_expedientes_tb_profesionales` (`profesional_id`),
  CONSTRAINT `FK_tb_expedientes_tb_profesionales` FOREIGN KEY (`profesional_id`) REFERENCES `tb_profesionales` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE IF NOT EXISTS `tb_expedientes_eventos` (
  `id` bigint(20) NOT NULL DEFAULT 0,
  `expediente_id` bigint(20) NOT NULL DEFAULT 0,
  `fecha` date NOT NULL,
  `descripcion` mediumtext NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE,
  CONSTRAINT `tb_expedientes_eventos_ibfk_1` FOREIGN KEY (`id`) REFERENCES `tb_expedientes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE IF NOT EXISTS `tb_pagos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `profesional_id` bigint(20) NOT NULL,
  `fecha` date NOT NULL,
  `descripcion` varchar(50) NOT NULL,
  `comprobante` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE IF NOT EXISTS `tb_profesionales` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `DNI` varchar(10) NOT NULL,
  `CUIT` varchar(13) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `matricula` varchar(13) NOT NULL,
  `domicilio` varchar(60) DEFAULT NULL,
  `localidad` varchar(30) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `activo` bit(1) DEFAULT NULL,
  `estado_matricula` bigint(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `profesional_DNI` (`DNI`) USING BTREE,
  KEY `FK_tb_profesionales_tb_estados_matriculas` (`estado_matricula`),
  CONSTRAINT `FK_tb_profesionales_tb_estados_matriculas` FOREIGN KEY (`estado_matricula`) REFERENCES `tb_estados_matriculas` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

INSERT IGNORE INTO `tb_profesionales` (`id`, `nombre`, `DNI`, `CUIT`, `email`, `matricula`, `domicilio`, `localidad`, `fecha_nacimiento`, `imagen`, `activo`, `estado_matricula`, `created_at`, `updated_at`) VALUES
	(5, 'PROFESIONAL 1', '88888888', '99-88888888-9', 'mail@mail.com', '9-99999', 'Calle 1', 'Rosario', '0000-00-00', '', b'1', 1, '2024-02-14 19:11:51', '2024-02-14 19:11:51'),
	(8, 'PROFESIONAL 9999999', '999999999', '99-99999999-9', 'mail@mail.com', '9-99999', 'Calle 1', 'Rosario', '0000-00-00', '', b'1', 1, '2024-02-14 19:49:10', '2024-02-14 19:55:34');

CREATE TABLE IF NOT EXISTS `tb_profesionales_establecimientos` (
  `id` bigint(20) NOT NULL DEFAULT 0,
  `profesional_id` bigint(20) NOT NULL,
  `establecimiento_id` bigint(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_tb_profesionales_establecimientos_tb_profesionales` (`profesional_id`),
  KEY `FK_tb_profesionales_establecimientos_tb_establecimientos` (`establecimiento_id`),
  CONSTRAINT `FK_tb_profesionales_establecimientos_tb_establecimientos` FOREIGN KEY (`establecimiento_id`) REFERENCES `tb_establecimientos` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_tb_profesionales_establecimientos_tb_profesionales` FOREIGN KEY (`profesional_id`) REFERENCES `tb_profesionales` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
