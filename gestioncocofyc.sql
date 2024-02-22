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
  `id` char(36) NOT NULL DEFAULT '0',
  `descripcion` varchar(30) NOT NULL,
  `vencimento` date NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE IF NOT EXISTS `tb_establecimientos` (
  `id` char(36) NOT NULL DEFAULT '0',
  `establecimiento` varchar(100) NOT NULL,
  `titular` varchar(50) NOT NULL,
  `telefono` varchar(30) NOT NULL,
  `email` varchar(255) NOT NULL,
  `CUIT` varchar(13) DEFAULT NULL,
  `domicilio` varchar(60) DEFAULT NULL,
  `localidad` varchar(30) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT IGNORE INTO `tb_establecimientos` (`id`, `establecimiento`, `titular`, `telefono`, `email`, `CUIT`, `domicilio`, `localidad`, `created_at`, `updated_at`) VALUES
	('9bc86153-b916-44d6-bceb-43e2381d7e3b', 'ESTABLECIMIENTO 1', 'SEÑOR ESTABLECIMIENTO 1', '111-111111', '1mail@mail.com', '11-11111111-1', 'Calle ESTABLECIMIENTO 1', 'Rosario', '2024-02-16 00:16:05', '2024-02-16 00:16:05');

CREATE TABLE IF NOT EXISTS `tb_estados_matriculas` (
  `id` char(36) NOT NULL DEFAULT '0',
  `estado` varchar(30) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT IGNORE INTO `tb_estados_matriculas` (`id`, `estado`, `created_at`, `updated_at`) VALUES
	('50cf3cf8-d914-4984-960b-a60fedc0c258', 'RETIRÓ', '2024-02-16 00:22:05', '2024-02-16 00:22:05');

CREATE TABLE IF NOT EXISTS `tb_expedientes` (
  `id` char(36) NOT NULL DEFAULT '0',
  `profesional_id` char(36) NOT NULL DEFAULT '0',
  `fecha` date NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_tb_expedientes_tb_profesionales` (`profesional_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE IF NOT EXISTS `tb_expedientes_eventos` (
  `id` char(36) NOT NULL DEFAULT '0',
  `expediente_id` char(36) NOT NULL DEFAULT '0',
  `fecha` date NOT NULL,
  `descripcion` mediumtext NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE IF NOT EXISTS `tb_pagos` (
  `id` char(36) NOT NULL DEFAULT '0',
  `profesional_id` char(36) NOT NULL DEFAULT '0',
  `fecha` date NOT NULL,
  `descripcion` varchar(50) NOT NULL,
  `comprobante` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE IF NOT EXISTS `tb_profesionales` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `dni` varchar(8) NOT NULL,
  `cuit` varchar(11) DEFAULT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `matricula` varchar(10) NOT NULL,
  `domicilio` varchar(50) DEFAULT NULL,
  `localidad` varchar(50) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `activo` tinyint(4) NOT NULL,
  `estado_matricula_id` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dni` (`dni`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT IGNORE INTO `tb_profesionales` (`id`, `nombre`, `dni`, `cuit`, `telefono`, `email`, `matricula`, `domicilio`, `localidad`, `fecha_nacimiento`, `imagen`, `activo`, `estado_matricula_id`, `created_at`, `updated_at`) VALUES
	('04d940af-cfa2-44ce-91a0-c34260509510', 'PROFESIONAL 11', '11', '12-54-7', NULL, '12mail@mail.com', '77777-7', 'Calle 7', 'Rosario', '0000-00-00', '', 1, NULL, '2024-02-19 18:27:16', '2024-02-19 18:27:16'),
	('0646015f-7d12-4abb-bc03-ba0b2db22fcd', 'PROFESIONAL 12', '12', '12-54-7', NULL, '12mail@mail.com', '77777-7', 'Calle 7', 'Rosario', '0000-00-00', '', 1, NULL, '2024-02-19 18:27:23', '2024-02-19 18:27:23'),
	('091d7518-e810-4e8b-a48d-88b4fe3bbb97', 'PROFESIONAL 2', '2', '12-55-7', NULL, '12mail@mail.com', '77777-7', 'Calle 7', 'Rosario', '0000-00-00', '', 1, NULL, '2024-02-19 18:27:10', '2024-02-19 18:27:10'),
	('438db041-caff-4eee-b3ac-2bac1fa749eb', 'PROFESIONAL 1', '11111111', '11-11111111', '111111111', '1mail@mail.com', '11111-1', 'Calle 1', 'Rosario', '0000-00-00', '', 1, '1', NULL, NULL),
	('550da60e-801e-43fd-9577-2d358778574a', 'PROFESIONAL 5', '555', '12-55-7', NULL, '12mail@mail.com', '77777-7', 'Calle 7', 'Rosario', '0000-00-00', '', 0, NULL, '2024-02-19 18:26:32', '2024-02-19 18:26:32'),
	('82aa1d70-245a-41c8-a173-46d8fac67739', 'PROFESIONAL 8', '8', '12-55-7', NULL, '12mail@mail.com', '77777-7', 'Calle 7', 'Rosario', '0000-00-00', '', 1, NULL, '2024-02-19 18:26:51', '2024-02-19 18:26:51'),
	('947978b3-a61c-428a-82d9-5adcba181d9e', 'PROFESIONAL 3', '33333333', '33-33333333', '333-3333333', '3mail@mail.com', '33333-3', 'Calle 3', 'Rosario', '0000-00-00', '', 1, '1', '2024-02-16 00:01:57', '2024-02-16 00:01:57'),
	('947fec4f-233e-4506-b7b7-475d038b2fc1', 'PROFESIONAL 6', '66666', '12-55-7', NULL, '12mail@mail.com', '77777-7', 'Calle 7', 'Rosario', '0000-00-00', '', 1, NULL, '2024-02-19 18:26:39', '2024-02-19 18:26:39'),
	('a0c63d2b-5ae1-4b4f-8805-9d3aa934d238', 'PROFESIONAL 7', '7777', '12-55-7', NULL, '12mail@mail.com', '77777-7', 'Calle 7', 'Rosario', '0000-00-00', '', 1, NULL, '2024-02-19 18:26:46', '2024-02-19 18:26:46'),
	('a6bd907c-8666-4d7b-b887-596cb8f5719d', 'PROFESIONAL 9', '9', '12-55-7', NULL, '12mail@mail.com', '77777-7', 'Calle 7', 'Rosario', '0000-00-00', '', 1, NULL, '2024-02-19 18:26:54', '2024-02-19 18:26:54'),
	('d9b2ccea-59e0-4c8a-9733-7cba7e72ced4', 'PROFESIONAL 1', '22222222', '22-22222222', '2222222220', '2mail@mail.com', '22222-2', 'Calle 2', 'Rosario', '0000-00-00', '', 0, '1', NULL, NULL),
	('ec249d34-488d-4854-ad90-1e7f72284ef2', 'PROFESIONAL 10', '10', '12-55-7', NULL, '12mail@mail.com', '77777-7', 'Calle 7', 'Rosario', '0000-00-00', '', 1, NULL, '2024-02-19 18:27:00', '2024-02-19 18:27:00');

CREATE TABLE IF NOT EXISTS `tb_profesionales_establecimientos` (
  `id` char(36) NOT NULL DEFAULT '0',
  `profesional_id` char(36) NOT NULL DEFAULT '0',
  `establecimiento_id` char(36) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_tb_profesionales_establecimientos_tb_profesionales` (`profesional_id`),
  KEY `FK_tb_profesionales_establecimientos_tb_establecimientos` (`establecimiento_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
