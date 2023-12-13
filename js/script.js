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



function selectTalent(selectedTalent) {
    output.innerHTML += `<br>你选择了天赋：${selectedTalent}。<br>`;
    saveDataToBackend('save_talents.php', { talents: selectedTalent });
    talents = talents.filter(talent => talent !== selectedTalent);
    allocateAttributePoints(selectedTalent);
}


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

    output.innerHTML += '<br>正式开始重生：<br>';

    const events = [
        '你参加了一场盛大的派对，结交了一些新朋友。',
        '你因为聪明的头脑在工作中获得了晋升。',
        '你因为良好的健康状况能够参加一场激动人心的体育比赛。',
        '你得知自己患上了一种严重的疾病，需要进行治疗。',
        '你在一次事故中受伤，康复期较长。',
        '你因为经营有方成功创业，成为了一名成功的企业家。',
        '你与爱人结婚，并迎来了可爱的孩子。',
        '你在一场意外中不幸身亡。',
    ];

    let age = 0;

    function simulateYear() {
        age++;

        const randomIndex = Math.floor(Math.random() * events.length);
        const eventDescription = events[randomIndex];
        output.innerHTML += `(${age}岁) ${eventDescription}<br>`;

        if (eventDescription.includes('死') || eventDescription.includes('去世') || eventDescription.includes('亡')) {
            output.innerHTML += '<br>游戏结束。';
            saveDataToBackend('save_age.php', { age: age });
        }
		else {
            // 继续模拟下一年
            setTimeout(simulateYear, 100);
        }

    }
    // 初始调用
    setTimeout(simulateYear, 100);
}