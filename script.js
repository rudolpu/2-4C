const API_URL = "https://script.google.com/macros/s/AKfycbyz0XDGujBH5VEGYbwq3aYX7PJgbubd5IvPZFNpinxBJSiHbNxNoOGpp10SRiElDGhafg/exec";

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

// 데이터 불러오기 (Google Sheets에서)
function loadData() { 
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            document.getElementById("noticeDisplay").textContent = data.notice || "공지 없음";
            document.getElementById("menuDisplay").textContent = data.lunch || "급식표 없음";
            document.getElementById("ddayDisplay").textContent = data.dday || "D-Day 없음";
        })
        .catch(error => console.error("데이터 불러오기 오류:", error));
}

// 데이터 저장 (Google Sheets에 저장, 관리자만 가능)
function saveData() {
    if (!isAdmin) return alert("관리자만 수정할 수 있습니다!");
    if (!confirm("정말 저장하시겠습니까?")) return;

    const newData = {
        notice: document.getElementById("noticeInput").value,
        lunch: document.getElementById("menuInput").value,
        dday: document.getElementById("examDateInput").value
    };

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData)
    })
    .then(response => response.text())
    .then(result => {
        alert("데이터가 저장되었습니다!");
        loadData();  // 저장 후 데이터 다시 불러오기
    })
    .catch(error => console.error("데이터 저장 오류:", error));
}

// 시험 D-Day 설정
function updateDday() {
    let examDateStr = document.getElementById("examDateInput").value;
    if (examDateStr) {
        let examDate = new Date(examDateStr);
        let today = new Date();
        let timeDiff = examDate.getTime() - today.getTime();
        let daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        document.getElementById("ddayDisplay").textContent = daysLeft >= 0 ? "(D-" + daysLeft + ")" : "(시험 종료)";
    }
}

// 페이지 로드 시 데이터 불러오기
window.onload = function () {
    loadData();
    showAdminFeatures();
};
