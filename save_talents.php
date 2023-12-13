<?php
// save_talents.php

// 保存天赋的函数
function saveTalents($talents) {
    // 连接数据库
    $conn = new mysqli("127.0.0.1", "root", "", "game_database");

    // 检查连接是否成功
    if ($conn->connect_error) {
        die("数据库连接失败：" . $conn->connect_error);
    }

//    // 清空原有的天赋数据（每个用户只保存一组天赋的情况）
//    $conn->query("DELETE FROM talents");

    // 如果传入的参数是字符串，则将其转换为数组
    if (!is_array($talents)) {
        $talents = [$talents];
    }

    // 插入新的天赋数据
    foreach ($talents as $talent) {
        $conn->query("INSERT INTO talents (talent) VALUES ('$talent')");
    }

    // 关闭数据库连接
    $conn->close();
}


if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // 获取前端传递的天赋数据
    $postData = json_decode(file_get_contents("php://input"), true);
    $talents = $postData['talents'];

    // 在这里调用保存天赋的函数
    saveTalents($talents);

    // 仅返回响应，通知前端保存成功
    echo json_encode(["message" => "天赋保存成功"]);
} else {
    // 如果不是 POST 请求，返回错误信息
    header("HTTP/1.1 405 Method Not Allowed");
    echo json_encode(["error" => "Method Not Allowed"]);
}
?>
