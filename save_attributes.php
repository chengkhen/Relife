<?php
// save_attributes.php

// 获取POST数据
$data = json_decode(file_get_contents('php://input'), true);

// 建立数据库连接
$conn = new mysqli("127.0.0.1", "root", "", "game_database");

// 检查连接是否成功
if ($conn->connect_error) {
    // 返回错误信息
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Connection failed: ' . $conn->connect_error]);
    exit;
}

// 插入数据到数据库
$sql = "INSERT INTO attributes (Looks, Intelligence, PhysicalCondition, Background)
VALUES ('" . $data['Looks'] . "', '" . $data['Intelligence'] . "', '" . $data['PhysicalCondition'] . "', '" . $data['Background'] . "')";

if ($conn->query($sql) === TRUE) {
    // 返回成功信息
    header('Content-Type: application/json');
    echo json_encode(['message' => '属性保存成功']);
} else {
    // 返回错误信息
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Error: ' . $sql . '<br>' . $conn->error]);
}

// 关闭数据库连接
$conn->close();
?>
