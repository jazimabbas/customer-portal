-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 24, 2024 at 03:09 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cms`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int(11) NOT NULL,
  `admin_password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `admin_password`, `email`) VALUES
(1, 'admin123','admin@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `customer_id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `auto_gate_brand` varchar(255) DEFAULT NULL,
  `alarm_brand` varchar(255) DEFAULT NULL,
  `warranty` date DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`customer_id`, `name`, `email`, `password`, `phone_number`, `location`, `auto_gate_brand`, `alarm_brand`, `warranty`) VALUES
(1, 'John Doe', 'john@example.com', 'password123', '1234567890', '123 Main St, Cityville', 'Brand X', 'Brand Y', '2024-12-31'),
(2, 'Alice Smith', 'alice@example.com', 'securepass', '9876543210', '456 Elm St, Townsville', 'Brand Z', 'Brand X', '2025-06-30');

-- --------------------------------------------------------

--
-- Table structure for table `ordertable`
--

CREATE TABLE `ordertable` (
  `order_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `order_date` date DEFAULT NULL,
  `order_done_date` date DEFAULT NULL,
  `order_time` time DEFAULT NULL,
  `order_status` enum('pending','ongoing','completed','cancelled') DEFAULT 'pending',
  `order_detail` varchar(255) DEFAULT NULL,
  `order_img` varchar(255) DEFAULT NULL,
  `order_done_img` varchar(255) DEFAULT NULL,
  `urgency_level` enum('standard','urgent','emergency') DEFAULT NULL,
  `problem_type` enum('alarm','autogate') DEFAULT NULL,
  `technician_id` int(11) DEFAULT NULL,
  `technician_eta` date DEFAULT NULL,
  `cancel_details` varchar(255) DEFAULT NULL,
  `location_details` varchar(255) DEFAULT NULL,
  `price_details` varchar(255) DEFAULT NULL,
  `price_status` enum('paid','unpaid') DEFAULT 'unpaid',
  `total_price` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ordertable`
--

INSERT INTO `ordertable` (`order_id`, `customer_id`, `order_date`, `order_time`, `order_status`, `order_detail`, `order_img`, `order_done_img`, `urgency_level`, `technician_id`, `cancel_details`, `location_details`, `price_details`, `price_status`) VALUES
(1, 1, '2024-04-15', '14:30:00', 'pending', 'Replace alarm system battery', 'img123.jpg', NULL, 'standard', NULL, NULL, 'Backyard door', 'https://example.com/pricing', 'unpaid'),
(2, 2, '2024-04-16', '10:00:00', 'ongoing', 'Install autogate opener', 'img456.jpg', NULL, 'urgent', NULL, NULL, 'Front gate', 'https://example.com/pricing', 'paid'),
(5, 1, '2024-04-15', '14:30:00', 'pending', 'Replace alarm system battery', 'img123.jpg', NULL, 'standard', NULL, NULL, 'Backyard door', 'https://example.com/pricing', 'unpaid'),
(6, 2, '2024-04-16', '10:00:00', 'ongoing', 'Install autogate opener', 'img456.jpg', NULL, 'urgent', NULL, NULL, 'Front gate', 'https://example.com/pricing', 'paid'),
(7, 1, '2024-04-15', '14:30:00', 'pending', 'Replace alarm system battery', 'img123.jpg', NULL, 'standard', NULL, NULL, 'Backyard door', 'https://example.com/pricing', 'unpaid'),
(8, 2, '2024-04-16', '10:00:00', 'ongoing', 'Install autogate opener', 'img456.jpg', NULL, 'urgent', NULL, NULL, 'Front gate', 'https://example.com/pricing', 'paid');

-- --------------------------------------------------------

--
-- Table structure for table `requestspareparttable`
--

CREATE TABLE `requestspareparttable` (
  `request_id` int(11) NOT NULL,
  `spare_part` varchar(255) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `status` enum('pending','accepted','decline') DEFAULT 'pending',
  `technician_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `requestspareparttable`
--

INSERT INTO `requestspareparttable` (`request_id`, `spare_part`, `date`, `status`, `technician_id`) VALUES
(7, 'Battery pack', '2024-04-16', 'accepted', 1),
(8, 'Motor assembly', '2024-04-17', 'accepted', 2);

-- --------------------------------------------------------

--
-- Table structure for table `technician`
--

CREATE TABLE `technician` (
  `technician_id` int(11) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `specialization` enum('alarm','autogate') DEFAULT NULL,
  `status` enum('working','free') DEFAULT 'free',
  `ongoing_order_id` int(11) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `technician`
--

INSERT INTO `technician` (`technician_id`, `email`, `name`, `password`, `specialization`, `status`, `ongoing_order_id`, `phone_number`) VALUES
(1, 'tech1@example.com', 'Bob Technician', 'techpass', 'alarm', 'free', NULL, '555-5555'),
(2, 'tech2@example.com', 'Sally Engineer', 'sallypass', 'autogate', 'working', NULL, '666-6666'),
(19, 'tech1@example.com', 'Bob Technician', 'techpass', 'alarm', 'free', NULL, '555-5555'),
(20, 'tech2@example.com', 'Sally Engineer', 'sallypass', 'autogate', 'working', NULL, '666-6666');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`customer_id`);

--
-- Indexes for table `ordertable`
--
ALTER TABLE `ordertable`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `fk_customer_id` (`customer_id`),
  ADD KEY `fk_technician_id` (`technician_id`);

--
-- Indexes for table `requestspareparttable`
--
ALTER TABLE `requestspareparttable`
  ADD PRIMARY KEY (`request_id`),
  ADD KEY `technician_id` (`technician_id`);

--
-- Indexes for table `technician`
--
ALTER TABLE `technician`
  ADD PRIMARY KEY (`technician_id`),
  ADD KEY `ongoing_order_id` (`ongoing_order_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `ordertable`
--
ALTER TABLE `ordertable`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `requestspareparttable`
--
ALTER TABLE `requestspareparttable`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `technician`
--
ALTER TABLE `technician`
  MODIFY `technician_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ordertable`
--
ALTER TABLE `ordertable`
  ADD CONSTRAINT `fk_customer_id` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_technician_id` FOREIGN KEY (`technician_id`) REFERENCES `technician` (`technician_id`) ON DELETE SET NULL;

--
-- Constraints for table `requestspareparttable`
--
ALTER TABLE `requestspareparttable`
  ADD CONSTRAINT `requestspareparttable_ibfk_1` FOREIGN KEY (`technician_id`) REFERENCES `technician` (`technician_id`) ON DELETE CASCADE;

--
-- Constraints for table `technician`
--
ALTER TABLE `technician`
  ADD CONSTRAINT `technician_ibfk_1` FOREIGN KEY (`ongoing_order_id`) REFERENCES `ordertable` (`order_id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
