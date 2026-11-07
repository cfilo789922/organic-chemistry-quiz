//官能基データ
const functionalGroups = [
    {
        id: 1,
        name: "ヒドロキシ基",
        generalName: "アルコール・フェノール類",
        structure: "OH"
    },{
        id: 2,
        name: "エーテル結合",
        generalName: "エーテル",
        structure: "O"
    },{
        id: 3,
        name: "カルボニル基",
        generalName: "ケトン",
        structure: "CO"

    },{
        id: 4,
        name: "ホルミル基",
        generalName: "アルデヒド",
        structure: "CHO"
    },{
        id: 5,
        name: "カルボキシ基",
        generalName: "カルボン酸",
        structure: "COOH",
    },{
        id: 6,
        name: "エステル結合",
        generalName: "エステル",
        structure: "COO"
    },{
        id: 7,
        name: "アミノ基",
        generalName: "アミン",
        structure: "NH2"
    },{
        id: 8,
        name: "アミド結合",
        generalName: "アミド",
        structure: "CONH"
    }
];

//変数
let shuffledGroups = [...functionalGroups];
let choices = document.getElementById("choices");
let studyRecords=[];

let savedRecords = localStorage.getItem("studyRecords");

if(savedRecords){
    studyRecords = JSON.parse(savedRecords);
}else{
    studyRecords = functionalGroups.map(group =>({
    id: group.id,
    correct:0,
    attempts: 0
    }));
}

//初期値
let selectedMode = 0;
let currentQuestion = 0;
let correctCount = 0;








//クイズ画面表示
function startQuiz(mode){
    selectedMode = mode;
    currentQuestion = 0;
    correctCount = 0;

    shuffledGroups = [...functionalGroups];
    shuffledGroups.sort((a,b) => Math.random() - 0.5)


    document.getElementById("menu").style.display = "none";
    document.getElementById("record-screen").style.display = "none";
    document.getElementById("quiz-screen").style.display = "block";

    document.getElementById("quiz-title").textContent = 
        "モード" + mode;

    showQuestion();
}


//結果画面表示
function showRecords(){
    document.getElementById("menu").style.display = "none";
    document.getElementById("quiz-screen").style.display = "none";
    document.getElementById("record-screen").style.display = "block";

    let recordList = document.getElementById("record-list");
    recordList.innerHTML = "";

    studyRecords.forEach(record => {
        let group = functionalGroups.find(item => item.id === record.id);

        let rate = record.attempts === 0
            ? 0
            :Math.round(record.correct / record.attempts * 100);

        recordList.innerHTML +=`
            <p>${group.name}：${rate}％
            (${record.correct}/${record.attempts})</P>
            `;
    });
}

//問題表示
function showQuestion(){
    let currentQuiz = shuffledGroups[currentQuestion];

    if(selectedMode === 1){  //構造式→官能基名
        document.getElementById("question").innerHTML = 
        drawStructure(currentQuiz.structure);
    }else if(selectedMode === 2){  //構造式→一般名
        document.getElementById("question").innerHTML = 
        drawStructure(currentQuiz.structure);
    }else{   //官能基名→構造式
        document.getElementById("question").textContent = 
        currentQuiz.name;
    }

    showChoices();
}


//選択肢表示
function showChoices(){
    choices.innerHTML = "";

    functionalGroups.forEach(group =>{
        let button = document.createElement("button");

        if(selectedMode === 1){
            button.textContent = group.name;
        }else if(selectedMode === 2){
            button.textContent = group.generalName;
        }else{
            button.innerHTML = drawStructure(group.structure);
        }

        button.onclick = function(){
            checkAnswer(group,button);
        };

        choices.appendChild(button);
    })
}


//正誤判定
function checkAnswer(selectedGroup, selectedButton){
    let correctGroup = shuffledGroups[currentQuestion];
    let record = studyRecords.find(item => item.id ===correctGroup.id);
    record.attempts++;
    
    if(selectedGroup.id === correctGroup.id){
        correctCount++;
        document.getElementById("feedback").textContent = "正解！";
        selectedButton.style.backgroundColor = "lightgreen";
        record.correct++;
    }
    else{
        if(selectedMode === 1){
            document.getElementById("feedback").textContent = 
            "不正解。正解は" + correctGroup.name;
            selectedButton.style.backgroundColor = "red";
        }else if(selectedMode === 2){
            document.getElementById("feedback").textContent =
            "不正解。正解は" + correctGroup.generalName;
            selectedButton.style.backgroundColor = "red";

        }else{
            document.getElementById("feedback").innerHTML =
            "不正解。正解は" +drawStructure(correctGroup.structure);
            selectedButton.style.backgroundColor = "red";

        }

    localStorage.setItem("studyRecords",JSON.stringify(studyRecords));
    }

    choices.querySelectorAll("button").forEach(button => {
        button.disabled = true;
        });

    document.getElementById("next-button").style.display = "block";

}


//次の問題へ
function nextQuestion(){
    currentQuestion++;

    if(currentQuestion >= shuffledGroups.length){
        showResult();
        return;
    }

    document.getElementById("next-button").style.display = "none";
    document.getElementById("feedback").textContent = "";

    showQuestion();
}


//結果表示
function showResult(){
    document.getElementById("quiz-screen").style.display = "none";
    document.getElementById("result-screen").style.display = "block";

    document.getElementById("result-score").textContent =
        correctCount + "/" + shuffledGroups.length + "問正解";
}


//メニューへ戻る
function returnMenu(){
    document.getElementById("result-screen").style.display = "none";
    document.getElementById("menu").style.display = "block";
}


//構造式描画
//構造式描画
function drawStructure(structure) {
    const structures = {
        // ヒドロキシ基：R-O-H
        OH: {
            lines: `
                <line x1="40" y1="40" x2="60" y2="40"/>
                <line x1="80" y1="40" x2="100" y2="40"/>
            `,
            atoms: `
                <text x="30" y="46">R</text>
                <text x="70" y="46">O</text>
                <text x="110" y="46">H</text>
            `
        },

        // エーテル結合：R-O-R
        O: {
            lines: `
                <line x1="40" y1="40" x2="60" y2="40"/>
                <line x1="80" y1="40" x2="100" y2="40"/>
            `,
            atoms: `
                <text x="30" y="46">R</text>
                <text x="70" y="46">O</text>
                <text x="110" y="46">R</text>
            `
        },

        // カルボニル基：R-C(=O)-R
        CO: {
            lines: `
                <line x1="40" y1="40" x2="60" y2="40"/>
                <line x1="80" y1="40" x2="100" y2="40"/>
                <line x1="66" y1="50" x2="66" y2="70"/>
                <line x1="74" y1="50" x2="74" y2="70"/>
            `,
            atoms: `
                <text x="30" y="46">R</text>
                <text x="70" y="46">C</text>
                <text x="110" y="46">R</text>
                <text x="70" y="86">O</text>
            `
        },

        // ホルミル基：R-CHO
        CHO: {
            lines: `
                <line x1="40" y1="40" x2="60" y2="40"/>
                <line x1="80" y1="40" x2="100" y2="40"/>
                <line x1="66" y1="50" x2="66" y2="70"/>
                <line x1="74" y1="50" x2="74" y2="70"/>
            `,
            atoms: `
                <text x="30" y="46">R</text>
                <text x="70" y="46">C</text>
                <text x="110" y="46">H</text>
                <text x="70" y="86">O</text>
            `
        },

        // カルボキシ基：R-COOH
        COOH: {
            lines: `
                <line x1="40" y1="40" x2="60" y2="40"/>
                <line x1="80" y1="40" x2="100" y2="40"/>
                <line x1="120" y1="40" x2="140" y2="40"/>
                <line x1="66" y1="50" x2="66" y2="70"/>
                <line x1="74" y1="50" x2="74" y2="70"/>
            `,
            atoms: `
                <text x="30" y="46">R</text>
                <text x="70" y="46">C</text>
                <text x="110" y="46">O</text>
                <text x="150" y="46">H</text>
                <text x="70" y="86">O</text>
            `
        },

        // エステル結合：R-COO-R
        COO: {
            lines: `
                <line x1="40" y1="40" x2="60" y2="40"/>
                <line x1="80" y1="40" x2="100" y2="40"/>
                <line x1="120" y1="40" x2="140" y2="40"/>
                <line x1="66" y1="50" x2="66" y2="70"/>
                <line x1="74" y1="50" x2="74" y2="70"/>
            `,
            atoms: `
                <text x="30" y="46">R</text>
                <text x="70" y="46">C</text>
                <text x="110" y="46">O</text>
                <text x="150" y="46">R</text>
                <text x="70" y="86">O</text>
            `
        },

        // アミノ基：R-NH2
        NH2: {
            lines: `
                <line x1="40" y1="40" x2="60" y2="40"/>
                <line x1="80" y1="40" x2="100" y2="40"/>
                <line x1="70" y1="50" x2="70" y2="70"/>
            `,
            atoms: `
                <text x="30" y="46">R</text>
                <text x="70" y="46">N</text>
                <text x="110" y="46">H</text>
                <text x="70" y="86">H</text>
            `
        },

        // アミド結合：R-CONH-R
        CONH: {
            lines: `
                <line x1="40" y1="40" x2="60" y2="40"/>
                <line x1="80" y1="40" x2="100" y2="40"/>
                <line x1="120" y1="40" x2="140" y2="40"/>
                <line x1="66" y1="50" x2="66" y2="70"/>
                <line x1="74" y1="50" x2="74" y2="70"/>
                <line x1="110" y1="50" x2="110" y2="70"/>
            `,
            atoms: `
                <text x="30" y="46">R</text>
                <text x="70" y="46">C</text>
                <text x="110" y="46">N</text>
                <text x="150" y="46">R</text>
                <text x="70" y="86">O</text>
                <text x="110" y="86">H</text>
            `
        }
    };

    const selected = structures[structure];

    if (!selected) {
        return "";
    }

    return `
        <svg
            viewBox="0 0 180 100"
            width="180"
            height="100"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g
                stroke="#333"
                stroke-width="2"
                stroke-linecap="round"
                fill="none"
            >
                ${selected.lines}
            </g>

            <g
                fill="#333"
                font-size="18"
                font-family="Arial, sans-serif"
                text-anchor="middle"
            >
                ${selected.atoms}
            </g>
        </svg>
    `;
}