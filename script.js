// 기본 상태: 읽기 모드
let isAdmin = false;

// 로그인 기능
function adminLogin() {
    let username = prompt("아이디를 입력하세요:");
    let password = prompt("비밀번호를 입력하세요:");
    if (username === "admin" && password === "password123") {  // 원하는 아이디 & 비밀번호 설정 가능
        isAdmin = true;
        alert("관리자 모드로 변경되었습니다!");
        localStorage.setItem("isAdmin", "true");
        showAdminFeatures();
    } else {
        alert("아이디 또는 비밀번호가 틀렸습니다.");
    }
}

// 로그아웃 기능
function adminLogout() {
    isAdmin = false;
    alert("읽기 모드로 변경되었습니다!");
    localStorage.removeItem("isAdmin");
    showAdminFeatures();
}

// 관리자 모드 UI 활성화 / 비활성화
function showAdminFeatures() {
    if (localStorage.getItem("isAdmin") === "true") {
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'block');
        isAdmin = true;
    } else {
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
        isAdmin = false;
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
    if (!isAdmin) return;
    let inputDate = document.getElementById("examDateInput").value;
    if (inputDate) {
        localStorage.setItem("examDate", inputDate);
        updateDday();
    }
}

// 공지 추가 & 삭제 (관리자만 가능)
function addNotice() {
    if (!isAdmin) return;
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
    if (!isAdmin) return;
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
        li.innerHTML = notice + (isAdmin ? " <button onclick='deleteNotice(" + index + ")'>삭제</button>" : "");
        noticeList.appendChild(li);
    });
}

// 급식표 추가 & 삭제 (관리자만 가능)
function updateMenu() {
    if (!isAdmin) return;
    let menuText = document.getElementById("menuInput").value;
    localStorage.setItem("menuText", menuText);
    document.getElementById("menuDisplay").textContent = menuText;
}

function deleteMenu() {
    if (!isAdmin) return;
    localStorage.removeItem("menuText");
    document.getElementById("menuDisplay").textContent = "";
}

// 건의사항 추가 (모두 가능) & 삭제 (관리자만 가능)
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
    suggestions.forEach((suggestion, index) => {
        let li = document.createElement("li");
        li.innerHTML = suggestion + (isAdmin ? " <button onclick='deleteSuggestion(" + index + ")'>삭제</button>" : "");
        suggestionList.appendChild(li);
    });
}

function deleteSuggestion(index) {
    if (!isAdmin) return;
    let suggestions = JSON.parse(localStorage.getItem("suggestions")) || [];
    suggestions.splice(index, 1);
    localStorage.setItem("suggestions", JSON.stringify(suggestions));
    displaySuggestions();
}

window.onload = function () {
    updateDday();
    displayNotices();
    displaySuggestions();
    document.getElementById("menuDisplay").textContent = localStorage.getItem("menuText") || "";
    showAdminFeatures();
};
