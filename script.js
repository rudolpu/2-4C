function updateDate() {
    let today = new Date();
    let formattedDate = today.getFullYear() + "년 " + (today.getMonth() + 1) + "월 " + today.getDate() + "일";
    document.getElementById("currentDate").textContent = "📅 " + formattedDate;
}

function checkDateReset() {
    let storedDate = localStorage.getItem("savedDate");
    let today = new Date().toDateString();

    if (storedDate !== today) {
        localStorage.setItem("savedDate", today);
        localStorage.removeItem("notices");
        localStorage.removeItem("menuText");
        localStorage.removeItem("suggestions");
    }
}

// D-Day 계산 및 표시
function updateDday() {
    let examDateStr = localStorage.getItem("examDate");
    if (examDateStr) {
        let examDate = new Date(examDateStr);
        let today = new Date();
        let timeDiff = examDate.getTime() - today.getTime();
        let daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysLeft >= 0) {
            document.getElementById("ddayDisplay").textContent = "(D-" + daysLeft + ")";
        } else {
            document.getElementById("ddayDisplay").textContent = "(시험 종료)";
        }
    }
}

function setExamDate() {
    let inputDate = document.getElementById("examDateInput").value;
    if (inputDate) {
        localStorage.setItem("examDate", inputDate);
        updateDday();
    }
}

// 공지 추가 & 삭제
function addNotice() {
    let input = document.getElementById("noticeInput").value;
    if (input.trim() !== "") {
        let notices = JSON.parse(localStorage.getItem("notices")) || [];
        notices.push(input);
        localStorage.setItem("notices", JSON.stringify(notices));
        displayNotices();
        document.getElementById("noticeInput").value = "";
    }
}

function deleteNotice(index) {
    let notices = JSON.parse(localStorage.getItem("notices")) || [];
    notices.splice(index, 1);
    localStorage.setItem("notices", JSON.stringify(notices));
    displayNotices();
}

function displayNotices() {
    let notices = JSON.parse(localStorage.getItem("notices")) || [];
    let noticeList = document.getElementById("notices");
    noticeList.innerHTML = "";
    notices.forEach((notice, index) => {
        let li = document.createElement("li");
        li.innerHTML = notice;
        noticeList.appendChild(li);
    });
}

// 급식표 추가 & 삭제
function updateMenu() {
    let menuText = document.getElementById("menuInput").value;
    localStorage.setItem("menuText", menuText);
    document.getElementById("menuDisplay").textContent = menuText;
}

function deleteMenu() {
    localStorage.removeItem("menuText");
    document.getElementById("menuDisplay").textContent = "";
}

// 건의사항 추가 & 삭제 (비공개)
const correctPassword = "1234";  // 원하는 비밀번호로 변경 가능

function showSuggestions() {
    let enteredPassword = document.getElementById("passwordInput").value;
    if (enteredPassword === correctPassword) {
        document.getElementById("suggestionList").style.display = "block";
        displaySuggestions();
    } else {
        alert("비밀번호가 틀렸습니다!");
    }
}

function submitSuggestion() {
    let input = document.getElementById("suggestionInput").value;
    if (input.trim() !== "") {
        let suggestions = JSON.parse(localStorage.getItem("suggestions")) || [];
        suggestions.push(input);
        localStorage.setItem("suggestions", JSON.stringify(suggestions));
        document.getElementById("suggestionInput").value = "";
    }
}

function displaySuggestions() {
    let suggestions = JSON.parse(localStorage.getItem("suggestions")) || [];
    let suggestionList = document.getElementById("suggestionList");
    suggestionList.innerHTML = "";
    suggestions.forEach((suggestion) => {
        let li = document.createElement("li");
        li.innerHTML = suggestion;
        suggestionList.appendChild(li);
    });
}

window.onload = function () {
    updateDate();
    checkDateReset();
    updateDday();
    displayNotices();
    let menuText = localStorage.getItem("menuText") || "";
    document.getElementById("menuDisplay").textContent = menuText;

    // 읽기 전용 모드 적용 (공유된 링크에서는 수정 X)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("mode") === "readonly") {
        document.getElementById("editSection").style.display = "none";
        document.getElementById("adminSection").style.display = "none";
        document.getElementById("menuInput").style.display = "none";
        document.querySelector("#lunch-menu button").style.display = "none";
        document.getElementById("exam-dday").style.display = "none";
        document.getElementById("setExamDateButton").style.display = "none";
    }
};