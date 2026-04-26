-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: hotel_ohio
-- ------------------------------------------------------
-- Server version	8.0.44

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
-- Table structure for table `booking`
--

DROP TABLE IF EXISTS `booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `booking_confirmation_code` varchar(255) DEFAULT NULL,
  `check_in_date` date NOT NULL,
  `check_out_date` date DEFAULT NULL,
  `num_of_adults` int NOT NULL,
  `num_of_children` int NOT NULL,
  `total_num_of_guests` int NOT NULL,
  `room_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `selected_meal_plan_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKb6jhn9s6v53eb2cd9l7uhcd0m` (`room_id`),
  KEY `FK7udbel7q86k041591kj6lfmvw` (`user_id`),
  KEY `FK3frk5bxii3ektmelq9m2k8un0` (`selected_meal_plan_id`),
  CONSTRAINT `FK3frk5bxii3ektmelq9m2k8un0` FOREIGN KEY (`selected_meal_plan_id`) REFERENCES `meal_plans` (`id`),
  CONSTRAINT `FK7udbel7q86k041591kj6lfmvw` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKb6jhn9s6v53eb2cd9l7uhcd0m` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`),
  CONSTRAINT `booking_chk_1` CHECK ((`num_of_adults` >= 1)),
  CONSTRAINT `booking_chk_2` CHECK ((`num_of_children` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking`
--

LOCK TABLES `booking` WRITE;
/*!40000 ALTER TABLE `booking` DISABLE KEYS */;
INSERT INTO `booking` VALUES (12,'Z3B54HCEQN','2026-05-10','2026-05-20',2,3,5,2,2,NULL);
/*!40000 ALTER TABLE `booking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_services`
--

DROP TABLE IF EXISTS `booking_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_services` (
  `booking_id` bigint NOT NULL,
  `service_id` bigint NOT NULL,
  KEY `FKngnsxtjrx788eno0gd8h4fcqx` (`service_id`),
  KEY `FK96s1e9neeevdkrc0uir5rbsgx` (`booking_id`),
  CONSTRAINT `FK96s1e9neeevdkrc0uir5rbsgx` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`id`),
  CONSTRAINT `FKngnsxtjrx788eno0gd8h4fcqx` FOREIGN KEY (`service_id`) REFERENCES `hotel_services` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_services`
--

LOCK TABLES `booking_services` WRITE;
/*!40000 ALTER TABLE `booking_services` DISABLE KEYS */;
/*!40000 ALTER TABLE `booking_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hotel_gallery`
--

DROP TABLE IF EXISTS `hotel_gallery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hotel_gallery` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `caption` varchar(255) DEFAULT NULL,
  `category` varchar(255) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotel_gallery`
--

LOCK TABLES `hotel_gallery` WRITE;
/*!40000 ALTER TABLE `hotel_gallery` DISABLE KEYS */;
INSERT INTO `hotel_gallery` VALUES (2,'Single Room','Szobák','https://grand-hotel-ohio-images.s3.amazonaws.com/singleroom.jpg'),(3,'','Szobák','https://grand-hotel-ohio-images.s3.amazonaws.com/p2.jpg'),(4,'','Étterem','https://grand-hotel-ohio-images.s3.amazonaws.com/etterem.jpeg'),(5,'','Wellness','https://grand-hotel-ohio-images.s3.amazonaws.com/szauna.png'),(6,'','Medence','https://grand-hotel-ohio-images.s3.amazonaws.com/medence.png'),(7,'','Lobby','https://grand-hotel-ohio-images.s3.amazonaws.com/lobby.png');
/*!40000 ALTER TABLE `hotel_gallery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hotel_services`
--

DROP TABLE IF EXISTS `hotel_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hotel_services` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `available` bit(1) NOT NULL,
  `category` varchar(255) NOT NULL,
  `description` text,
  `name` varchar(255) NOT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `price` double NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotel_services`
--

LOCK TABLES `hotel_services` WRITE;
/*!40000 ALTER TABLE `hotel_services` DISABLE KEYS */;
INSERT INTO `hotel_services` VALUES (3,_binary '','Wellness','Élvezze a tradicionális thai masszázs ellazító és energetizáló hatását. Tapasztalt terapeutáink óvatos nyújtásokkal és speciális technikákkal oldják a feszültséget, javítják a vérkeringést, és megújítják a testet és a lelket. Tökéletes kikapcsolódás a városi forgatagból.','Thai masszázs','https://grand-hotel-ohio-images.s3.amazonaws.com/Thai-masszazs.jpg',40),(4,_binary '','Wellness','Lazítsa el izmait és töltődjön fel különböző masszázsainkkal, beleértve a svéd, aromaterápiás és forró köves kezeléseket.','Masszázs kezelések','https://grand-hotel-ohio-images.s3.amazonaws.com/masszazsok-kezelesek-3-1740057040.png',50),(5,_binary '','Wellness','Frissítse bőrét és nyugtassa érzékeit luxus kezeléseinkkel.','Arckezelések és testkezelések','https://grand-hotel-ohio-images.s3.amazonaws.com/arckezelesek.jpg',30),(6,_binary '','Sport','Teljesen felszerelt terem a napi edzéshez és formában maradáshoz.','Modern fitnessterem','https://grand-hotel-ohio-images.s3.amazonaws.com/gym.jpg',25),(7,_binary '','Sport','Erősítse testét és ellazítsa elméjét tapasztalt oktatóinkkal.','Jóga és pilates órák','https://grand-hotel-ohio-images.s3.amazonaws.com/pexels-polina-tankilevitch-3735471-scaled.jpg',20),(8,_binary '','Sport','Fedezze fel a várost aktívan, biciklivel vagy szervezett túrán.','Kerékpárbérlés / városi túrák','https://grand-hotel-ohio-images.s3.amazonaws.com/2-pic_Hyatt-Regency-Huntington-Beach-Resort-and-Spa-in-California.jpg',15),(9,_binary '','Étterem','Élvezze a séfünk által készített kulináris élményeket elegáns környezetben.',' Fine dining étterem','https://grand-hotel-ohio-images.s3.amazonaws.com/Fine-dining-4.jpg',60);
/*!40000 ALTER TABLE `hotel_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meal_plans`
--

DROP TABLE IF EXISTS `meal_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meal_plans` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price_per_night` double NOT NULL,
  `type` enum('ALL_INCLUSIVE','BREAKFAST','HALF_BOARD','NONE') NOT NULL,
  `meal_plan_type` enum('ALL_INCLUSIVE','BREAKFAST','HALF_BOARD','NONE') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKeuyoq1qhhhw9gb127dn0l3ghq` (`type`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meal_plans`
--

LOCK TABLES `meal_plans` WRITE;
/*!40000 ALTER TABLE `meal_plans` DISABLE KEYS */;
INSERT INTO `meal_plans` VALUES (1,'Csak reggeli',25,'BREAKFAST','ALL_INCLUSIVE'),(2,'All inclusive',200,'ALL_INCLUSIVE','ALL_INCLUSIVE'),(3,'Félpanzió',80,'HALF_BOARD','ALL_INCLUSIVE');
/*!40000 ALTER TABLE `meal_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_amenities`
--

DROP TABLE IF EXISTS `room_amenities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_amenities` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `icon` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `room_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKps6ofup9gxhn8juqvproxbaud` (`room_id`),
  CONSTRAINT `FKps6ofup9gxhn8juqvproxbaud` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_amenities`
--

LOCK TABLES `room_amenities` WRITE;
/*!40000 ALTER TABLE `room_amenities` DISABLE KEYS */;
INSERT INTO `room_amenities` VALUES (2,'?',' High-speed Wi-Fi',1),(3,'?','Smart TV / streaming lehetőségek',1),(4,'❄️','Légkondicionáló',1),(6,'?','Biztonságos széf értéktárgyaknak',1),(7,'?','Relaxációs kiegészítők és hangulatvilágítás',1),(8,'?','Tágas szekrény és tároló',1),(9,'?','Saját fürdőszoba, luxus piperecikkekkel',1),(10,'?','WiFi',2),(11,'?','TV',2),(12,'❄️','Klíma',2),(13,'?','Minibár',2),(14,'?','Fürdőkád',2),(15,'?','Zuhanyzó',2),(16,'?','Széf',2),(17,'?','Erkély',2),(18,'?','Hajszárító',2),(30,'?','WiFi',4),(31,'?','TV',4),(32,'❄️','Klíma',4),(33,'?','Minibár',4),(34,'?','Fürdőkád',4),(35,'?','Zuhanyzó',4),(36,'?','Széf',4),(37,'?','Erkély',4),(38,'?','Hajszárító',4),(39,'☕','Kávéfőző',4),(40,'?','Medence',4),(42,'?','WiFi',5),(43,'?','TV',5),(44,'❄️','Klíma',5),(45,'?','Minibár',5),(46,'?','Fürdőkád',5),(47,'?','Zuhanyzó',5),(48,'?','Széf',5),(49,'?','Erkély',5),(50,'?','Hajszárító',5),(51,'☕','Kávéfőző',5),(52,'?','Parkoló',5),(53,'?','Medence',5);
/*!40000 ALTER TABLE `room_amenities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_images`
--

DROP TABLE IF EXISTS `room_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_images` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `image_url` varchar(255) DEFAULT NULL,
  `room_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKtky1jnwoh1hv50m263p2vlt0y` (`room_id`),
  CONSTRAINT `FKtky1jnwoh1hv50m263p2vlt0y` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_images`
--

LOCK TABLES `room_images` WRITE;
/*!40000 ALTER TABLE `room_images` DISABLE KEYS */;
INSERT INTO `room_images` VALUES (1,'https://grand-hotel-ohio-images.s3.amazonaws.com/singleroom.jpg',1),(2,'https://grand-hotel-ohio-images.s3.amazonaws.com/Q7Krc5ZDgAbaLTMlDiHg_original.jpg',1),(3,'https://grand-hotel-ohio-images.s3.amazonaws.com/iW3VHqH4L5V28zMXlG9H_original.jpg',1),(4,'https://grand-hotel-ohio-images.s3.amazonaws.com/IleZUn4MqSKbee3V88ZT_original.jpg',1),(5,'https://grand-hotel-ohio-images.s3.amazonaws.com/d2.jpg',2),(6,'https://grand-hotel-ohio-images.s3.amazonaws.com/d3.jpg',2),(7,'https://grand-hotel-ohio-images.s3.amazonaws.com/IleZUn4MqSKbee3V88ZT_original.jpg',2),(15,'https://grand-hotel-ohio-images.s3.amazonaws.com/p8.jpg',4),(16,'https://grand-hotel-ohio-images.s3.amazonaws.com/d3.jpg',4),(17,'https://grand-hotel-ohio-images.s3.amazonaws.com/IleZUn4MqSKbee3V88ZT_original.jpg',4),(18,'https://grand-hotel-ohio-images.s3.amazonaws.com/p1.jpg',4),(19,'https://grand-hotel-ohio-images.s3.amazonaws.com/dl2.jpg',5),(20,'https://grand-hotel-ohio-images.s3.amazonaws.com/dl3.jpg',5),(21,'https://grand-hotel-ohio-images.s3.amazonaws.com/dl4.jpg',5),(22,'https://grand-hotel-ohio-images.s3.amazonaws.com/del.jpg',5);
/*!40000 ALTER TABLE `room_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_meal_plans`
--

DROP TABLE IF EXISTS `room_meal_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_meal_plans` (
  `room_id` bigint NOT NULL,
  `meal_plan_id` bigint NOT NULL,
  KEY `FKckb2dney2025s5tg3cl9hfvhw` (`meal_plan_id`),
  KEY `FKef744vqj9fx34yn19kipon9u0` (`room_id`),
  CONSTRAINT `FKckb2dney2025s5tg3cl9hfvhw` FOREIGN KEY (`meal_plan_id`) REFERENCES `meal_plans` (`id`),
  CONSTRAINT `FKef744vqj9fx34yn19kipon9u0` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_meal_plans`
--

LOCK TABLES `room_meal_plans` WRITE;
/*!40000 ALTER TABLE `room_meal_plans` DISABLE KEYS */;
INSERT INTO `room_meal_plans` VALUES (1,2),(1,1),(1,3),(2,1),(2,2),(2,3),(4,1),(4,2),(4,3),(5,1),(5,2),(5,3);
/*!40000 ALTER TABLE `room_meal_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `room_description` varchar(255) DEFAULT NULL,
  `room_photo_url` varchar(255) DEFAULT NULL,
  `room_price` int NOT NULL,
  `room_type` varchar(255) DEFAULT NULL,
  `meal_plan_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKpvff3egkyvafflqyfu940wg1g` (`meal_plan_id`),
  CONSTRAINT `FKpvff3egkyvafflqyfu940wg1g` FOREIGN KEY (`meal_plan_id`) REFERENCES `meal_plans` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,'Fedezze fel az Önnek tervezett, tágas és stílusos egyágyas szobánkat, ahol a luxus és a funkcionalitás találkozik. ','https://grand-hotel-ohio-images.s3.amazonaws.com/mbAiyz0gki5HqZkk3yLt_original.jpg',200,'Single room',NULL),(2,'Stílusos, modern kétágyas szoba kényelmes franciaággyal, tökéletes pároknak vagy üzleti utazóknak. Élvezze a nyugalmat és a minőségi pihenést a város szívében.','https://grand-hotel-ohio-images.s3.amazonaws.com/d1.jpg',250,'Standard Double Room',NULL),(4,'Élvezze a város nyüzsgésétől távol, de a medencére nyíló panorámával a Standard Pool View Room kényelmét. Modern dizájn, kényelmes ágy és prémium szolgáltatások biztosítják a zavartalan pihenést, miközben a medence látványa nyugtató környezetet teremt.','https://grand-hotel-ohio-images.s3.amazonaws.com/p2.jpg',300,'Standard Pool View',NULL),(5,'Élvezze a tágas és elegáns Deluxe Double Room nyújtotta prémium élményt. Modern dizájn, kényelmes nagyméretű ágy és extra szolgáltatások gondoskodnak a pihentető és luxus színvonalú tartózkodásról, tökéletes pároknak vagy üzleti vendégeknek.','https://grand-hotel-ohio-images.s3.amazonaws.com/del1.jpg',347,'Deluxe double room',NULL);
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `role` enum('ADMIN','STAFF','USER') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin@gmail.com','Lakatos','Ali','$2a$10$uU5vpw.D4FWiEiu4o4KKp.bsx7OECN4gk0JOmO5CVy6O.gVvoJUX.','+3620821721','ADMIN'),(2,'lambadalajos@gmail.com','Lajos','Lambada ','$2a$10$ujBxUfhMEzh7AZ5xBfLzDOJ4vbKAVneXudAinH8OOVYVOXuHVx3pC','0620776231','USER'),(3,'koroskenyitibi@gmail.com','Tibor','Köröskényi','$2a$10$bBGU9tYsSS0yhTrHmboRbeqoo3ugC/qAEZSpp0N07cgedF4AJ2som','0620663123','USER'),(4,'admin3@gmail.com','Nagy','Péter','$2a$10$lTYoJiuLxfeCljI9hxcyqO0784r33Q3Wmry3Q00MpZ/sgyeCLv/1O','+1234567890','ADMIN'),(5,'vncaron69@gmail.com','Áron Zoltán','Vincze','$2a$10$YjcS7RYZmXqoBLLFFUNjRe75S4vvuazJmy2hBZYZvl98OKkvclt8m','06208518110','USER'),(6,'orbantibi@gmail.com','Orbán','Tibor','$2a$10$a8BJgaI1YWFkcH8rux/oHep.p.itayfBnBTppAbRGhi656J42rsK6','+1234567890','STAFF'),(7,'vinzoltanvin@gmail.com','Zoltán','Vincze','$2a$10$jkz6UL3MEKwSRwmFjXsmTuadIBfttLc0PlHS1LzME7Cy.2K3UcvQm','06203327121','USER'),(8,'speti04@gmail.com','Simon','Péter','$2a$10$bHzD301b6.5/NG0I1c7dMOfyMlrwjThekP/rA7jhoF7e3L4CEwiBS','+1234567890','USER'),(9,'tartibi@gmail.com','tibor','tar','$2a$10$dr0T3oUKWwotsnPI9zzJaOb3A2B6Eah9jSK8r3XKuhpAoHlULysg2','0620822111','USER');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-26 19:38:48
