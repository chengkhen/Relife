<?php
// 获取传入的年龄参数
$age = $_GET['age'];

// 根据年龄段选择对应的表
if ($age == 1) {
    $table = 'birth';
} elseif ($age > 1 && $age < 6) {
    $table = 'kid';
} elseif ($age == 6) {
    $table = 'primary_school';
} elseif ($age > 6 && $age < 12) {
    $table = 'child';
} elseif ($age == 12) {
    $table = 'middle';
} elseif ($age > 12 && $age < 15) {
    $table = 'teen';
} elseif ($age == 15) {
    $table = 'high';
} elseif ($age > 15 && $age < 30 && $age != 18) {
    $table = 'young';
} elseif ($age == 18) {
    $table = 'university';
} elseif ($age >= 30 && $age <= 50) {
    $table = 'senior';
} else {
    $table = 'old';
}

// 连接数据库并查询事件
$connection = mysqli_connect('127.0.0.1', 'root', '', 'events');
if (!$connection) {
    die('数据库连接失败: ' . mysqli_connect_error());
}

$query = "SELECT events FROM $table ORDER BY RAND() LIMIT 1";
$result = mysqli_query($connection, $query);

if (!$result) {
    die('事件查询失败: ' . mysqli_error($connection));
}

// 获取事件描述并返回给前端
$row = mysqli_fetch_assoc($result);
$events = $row['events'];

$response = [
    'events' => $events,
];

header('Content-Type: application/json');
echo json_encode($response);

mysqli_close($connection);
?>
