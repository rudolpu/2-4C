// ✅ 수정 가능한 관리자 IP 설정 (여기에 네 실제 IP 주소 입력)
const allowedIP = "XXX.XXX.XXX.XXX";  // 여기에 관리자 IP 입력

// 기본 상태: 읽기 모드
let isAdmin = false;

// 사용자의 IP 가져오기
function checkUserIP() {
    fetch("https://api64.ipify.org?format=json")  // 외부 API에서 IP 가져오기
        .then(response => response.json())
        .then(data => {
            if (data.ip === allowedIP) {
                isAdmin = true;
                localStorage.setItem("isAdmin", "true");
            } else {
                isAdmin = false;
                localStorage.removeItem("isAdmin");
            }
            showAdminFeatures();
        })
        .catch(error => console.error("IP 확인 오류:", error));
}

// 관리자 모드 UI 활성화 / 비활성화
function showAdminFeatures() {
    if (localStorage.getItem("isAdmin") === "true") {
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'block');
    } else {
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
    }
}

// 공지, 급식표 수정 기능 비활성화 (건의 사항 제외)
function disableEdits() {
    document.getElementById("noticeInput").disabled = !isAdmin;
    document.getElementById("menuInput").disabled = !isAdmin;
    document.getElementById("examDateInput").disabled = !isAdmin;

    document.querySelectorAll(".admin-only").forEach(el => {
        el.style.display = isAdmin ? "block" : "none";
    });
}

// D-Day 계산 및 표시
function updateDday() {
    let examDateStr = localStorage.getItem("examDate");
    if (examDateStr) {
        let examDate = new Date(examDateStr);
        let today = new Date();
        let timeDiff = examDate.getTime() - today.getTime();
        let daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        document.getElementById("ddayDisplay").textContent = daysLeft >= 0 ? "(D-" + daysLeft + ")" : "(시험 종료)";
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

// 건의 사항 추가 (누구나 가능) & 삭제 (관리자만 가능)
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

// 페이지 로드 시 실행
window.onload = function () {
    checkUserIP(); // IP 확인
    updateDday();
    displayNotices();
    displaySuggestions();
    document.getElementById("menuDisplay").textContent = localStorage.getItem("menuText") || "";
    disableEdits();
};
