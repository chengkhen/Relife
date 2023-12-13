<?php
// save_age.php

// 保存年龄的函数
function saveAge($age) {
    // 连接数据库
    $conn = new mysqli("127.0.0.1", "root", "", "game_database");

    // 检查连接是否成功
    if ($conn->connect_error) {
        die("数据库连接失败：" . $conn->connect_error);
    }

//    // 清空原有的年龄数据（这里假设每个用户只保存一组年龄，实际情况可能不同）
//    $conn->query("DELETE FROM age");

    // 插入新的年龄数据
    $conn->query("INSERT INTO age (age) VALUES ($age)");

    // 关闭数据库连接
    $conn->close();
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // 获取前端传递的年龄数据
    $postData = json_decode(file_get_contents("php://input"), true);
    $age = $postData['age'];

    // 在这里调用保存年龄的函数
    saveAge($age);

    // 仅返回响应，通知前端保存成功
    echo json_encode(["message" => "年龄保存成功"]);
} else {
    // 如果不是 POST 请求，返回错误信息
    header("HTTP/1.1 405 Method Not Allowed");
    echo json_encode(["error" => "Method Not Allowed"]);
}

?>