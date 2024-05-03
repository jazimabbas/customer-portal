-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: cms
-- ------------------------------------------------------
-- Server version	8.0.36-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ordertable`
--

DROP TABLE IF EXISTS `ordertable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordertable` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int DEFAULT NULL,
  `order_date` date DEFAULT NULL,
  `order_time` time DEFAULT NULL,
  `order_status` enum('pending','ongoing','completed','cancelled') COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `order_detail` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `order_img` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `order_done_img` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `urgency_level` enum('standard','urgent','emergency') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `technician_id` int DEFAULT NULL,
  `cancel_details` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `location_details` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `price_details` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `price_status` enum('paid','unpaid') COLLATE utf8mb4_general_ci DEFAULT 'unpaid',
  `order_done_date` date DEFAULT NULL,
  `technician_eta` date DEFAULT NULL,
  `total_price` int DEFAULT NULL,
  `problem_type` enum('alarm','autogate') COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `fk_customer_id` (`customer_id`),
  KEY `fk_technician_id` (`technician_id`),
  CONSTRAINT `fk_customer_id` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_technician_id` FOREIGN KEY (`technician_id`) REFERENCES `technician` (`technician_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordertable`
--

LOCK TABLES `ordertable` WRITE;
/*!40000 ALTER TABLE `ordertable` DISABLE KEYS */;
INSERT INTO `ordertable` VALUES (1,6,'2024-04-15','14:30:00','completed','Replace 1 alarm system battery','uploads/1714568637165-Screenshot from 2024-04-30 23-19-47.png','uploads/1714568637165-Screenshot from 2024-04-30 23-19-47.png','standard',21,NULL,'Backyard door','https://example.com/pricing','paid','2024-01-01',NULL,210,'autogate'),(2,NULL,'2024-04-16','10:00:00','completed','Install autogate opener','uploads/1714568637165-Screenshot from 2024-04-30 23-19-47.png','uploads/1714568637165-Screenshot from 2024-04-30 23-19-47.png','urgent',NULL,NULL,'Front gate','https://example.com/pricing','paid','2024-02-01',NULL,220,'autogate'),(5,6,'2024-04-15','14:30:00','pending','Replace 2 alarm system battery','uploads/1714577471601-Screenshot from 2024-04-28 17-30-04.png',NULL,'standard',NULL,NULL,'Backyard door',NULL,'unpaid',NULL,NULL,NULL,'autogate'),(6,NULL,'2024-04-16','10:00:00','ongoing','Install autogate opener','uploads/1714577471601-Screenshot from 2024-04-28 17-30-04.png',NULL,'urgent',23,NULL,'Front gate',NULL,'unpaid',NULL,NULL,NULL,'autogate'),(7,NULL,'2024-04-15','14:30:00','pending','Replace 3 alarm system battery','uploads/1714577471601-Screenshot from 2024-04-28 17-30-04.png',NULL,'standard',NULL,NULL,'Backyard door',NULL,'unpaid',NULL,NULL,NULL,'autogate'),(8,NULL,'2024-04-16','10:00:00','ongoing','Install autogate opener','uploads/1714577471601-Screenshot from 2024-04-28 17-30-04.png','','urgent',23,NULL,'Front gate',NULL,'unpaid',NULL,NULL,NULL,'autogate'),(9,6,'2024-05-01','18:03:57','pending','order detail is here','uploads/1714568637165-Screenshot from 2024-04-30 23-19-47.png',NULL,'standard',NULL,NULL,'Lahore Kwanso',NULL,'unpaid',NULL,NULL,NULL,'alarm'),(10,6,'2024-05-01','20:25:46','pending','my front gate is not working properly','uploads/1714577146574-Screenshot from 2024-04-30 23-19-47.png',NULL,'standard',23,NULL,'House front',NULL,'unpaid',NULL,NULL,NULL,'autogate'),(11,6,'2024-05-01','20:27:28','cancelled','house security alarm is not working','uploads/1714577248377-Screenshot from 2024-04-30 23-19-47.png',NULL,'emergency',21,'I just want to cancel my request','inside kitchen',NULL,'unpaid',NULL,NULL,NULL,'alarm'),(12,6,'2024-05-01','20:31:11','ongoing','2nd house security alarm is not working','uploads/1714577471601-Screenshot from 2024-04-28 17-30-04.png',NULL,'urgent',NULL,NULL,'2nd house inside kitchen',NULL,'unpaid',NULL,'2024-02-02',NULL,'alarm'),(13,6,'2024-05-01','20:31:21','cancelled','2nd house security alarm is not working','uploads/1714577481575-Screenshot from 2024-04-28 17-30-04.png',NULL,'urgent',NULL,'Cancel reason here','2nd house inside kitchen',NULL,'unpaid',NULL,NULL,NULL,'alarm'),(14,6,'2024-05-03','21:54:27','cancelled','Yes Autogate for demo purpose','uploads/1714755267903-Screenshot from 2024-04-27 16-27-41.png',NULL,'urgent',23,'No need ','Front gate',NULL,'unpaid',NULL,NULL,NULL,'autogate');
/*!40000 ALTER TABLE `ordertable` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-03 23:08:45
