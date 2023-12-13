let talents = [];
let selectedTalent = '';
let attributes = {
    '颜值': 0,
    '智慧': 0,
    '体质': 0,
    '家世': 0
};
let attributePoints = 20;
let age = 0;

function saveDataToBackend(url, data) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(responseData => {
            console.log(responseData);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function startGame() {
    const output = document.getElementById('output');
    output.innerHTML = '你决定开始新的一生！<br>';
    
    // 进入抽取天赋页面
    chooseTalents();
}

function chooseTalents() {
    const output = document.getElementById('output');
    output.innerHTML += '抽取天赋：<br>';
    
    const allTalents = ['富有', '聪明', '健康', '家族传承', '幸运', '颜值担当', '学霸', '体育健将', '艺术家的灵感', '社交达人'];
    
    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * allTalents.length);
        const talent = allTalents.splice(randomIndex, 1)[0];
        talents.push(talent);
        output.innerHTML += `<button onclick="selectTalent('${talent}')">${talent}</button>`;
    }
}


// 选择天赋函数
function selectTalent(selectedTalent) {
    output.innerHTML += `<br>你选择了天赋：${selectedTalent}。<br>`;
    saveDataToBackend('save_talents.php', { talents: selectedTalent });
    talents = talents.filter(talent => talent !== selectedTalent);
    allocateAttributePoints(selectedTalent);
}

//分配属性函数
function allocateAttributePoints(selectedTalent) {
    const output = document.getElementById('output');
    output.innerHTML += `<br>分配属性点：<span id="remainingPoints">可分配属性点：${attributePoints}</span><br>`;
    
    // 如果需要根据不同的天赋给予不同的初始属性点，可以在这里进行处理
    
    const attributesList = Object.keys(attributes);
    
    attributesList.forEach(attribute => {
        output.innerHTML += `<div>${attribute}：<input type="number" id="${attribute}" min="0" max="10" value="0" onchange="updateRemainingPoints()"></div>`;
    });
    
    output.innerHTML += '<button onclick="confirmAttributes()">确认</button>';
}

 

function updateRemainingPoints() {
    // 更新剩余可分配的属性点
    const inputElements = document.querySelectorAll('input');
    let usedPoints = 0;

    inputElements.forEach(input => {
        const value = parseInt(input.value);
        const newValue = isNaN(value) ? 0 : Math.max(value, 0); // 确保输入值不为负值
        input.value = newValue;  // 更新输入框的值
        usedPoints += newValue;
    });

    attributePoints = 20 - usedPoints;

    // 更新剩余点数显示
    const remainingPointsElement = document.getElementById('remainingPoints');
    remainingPointsElement.textContent = `可分配属性点：${attributePoints}`;

    // 禁用所有输入框，当可分配属性点为0时，只有增加某一属性无效
    const isAttributeIncreaseDisabled = attributePoints === 0;
    inputElements.forEach(input => {
        input.disabled = isAttributeIncreaseDisabled && input.value > 0;
    });
}



//传送属性数据到后端
function confirmAttributes() {
    const attributesList = Object.keys(attributes);
    const selectedAttributes = {};

    attributesList.forEach(attribute => {
        const inputElement = document.getElementById(attribute);
        selectedAttributes[attribute] = parseInt(inputElement.value);
    });

    // 将属性数据发送到服务器端
    saveDataToBackend('save_attributes.php', {
        Looks: selectedAttributes['颜值'],
        Intelligence: selectedAttributes['智慧'],
        PhysicalCondition: selectedAttributes['体质'],
        Background: selectedAttributes['家世']
    });

    startRebirth();
}


function startRebirth() {
    const output = document.getElementById('output');
    const selectedEvents = [];
    output.innerHTML += '<br>正式开始重生：<br>';

    let age = 0;

    function simulateYear() {
        age++;

        // 发起 Ajax 请求获取对应年龄段的事件
        fetch('get_events.php?age=' + age)
            .then(response => response.json())
            .then(data => {
                const eventDescription = data.events;
                output.innerHTML += `(${age}岁) ${eventDescription}<br>`;

                if (eventDescription !== undefined && typeof eventDescription === 'string' && (eventDescription.includes('死') || eventDescription.includes('去世') || eventDescription.includes('亡'))) {
                    output.innerHTML += '<br>游戏结束。';
                    saveDataToBackend('save_age.php', { age: age });
                    // 游戏结束时清空已选事件列表
                    selectedEvents.length = 0;
                } else {
                    // 检查是否已经选取过这个事件
                    if (selectedEvents.includes(eventDescription)) {
                        // 如果没有选取过，添加到已选事件列表，并显示
                        selectedEvents.push(eventDescription);
                        output.innerHTML += `(${age}岁) ${eventDescription}<br>`;
                    } else {
                        // 如果已经选取过，重新模拟下一年
                        setTimeout(simulateYear, 100);
                    }
                }
            })
            .catch(error => {
                console.error('发生错误:', error);
                output.innerHTML += `<br>发生错误: ${error.message}<br>`;
            });
    }

// 初始调用
    setTimeout(simulateYear, 100);


}

