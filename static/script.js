const gradePoints = {
    'A+': 10, 'A': 10, 'A-': 9, 'B': 8, 'B-': 7,
    'C': 6, 'C-': 5, 'D': 4, 'P': 2,
    'S/U': 0, 'AU': 0, 'F': 0
};

function showPage(pageId) {
    document.querySelectorAll('.container').forEach(page => {
        page.classList.remove('active-page');
    });
    document.getElementById(`${pageId}-page`).classList.add('active-page');
    window.scrollTo(0, 0);
}

function addCourse(type) {
    const container = document.getElementById(`${type}-courses`);
    const courseDiv = document.createElement('div');
    courseDiv.className = 'course-form';
    courseDiv.innerHTML = `
        <input type="text" placeholder="Code">
        <input type="text" placeholder="Title">
        <input type="number" placeholder="Credits" min="1">
        <select>${Object.keys(gradePoints).map(g => `<option value="${g}">${g}</option>`).join('')}</select>
        <button onclick="this.parentElement.remove()" style="background-color: #f44336; padding: 8px;">×</button>
    `;
    container.appendChild(courseDiv);
}

function calculateSGPA() {
    const courses = document.querySelectorAll('#sgpa-courses .course-form');
    let total = 0, credits = 0;
    courses.forEach(course => {
        const cred = Number(course.querySelector('input[type="number"]').value) || 0;
        const grade = course.querySelector('select').value;
        total += cred * gradePoints[grade];
        credits += cred;
    });
    const sgpa = credits ? (total / credits).toFixed(2) : 0;
    document.getElementById('sgpa-result').innerHTML = `SGPA: ${sgpa}<br>Total Credits: ${credits}`;
}

function addSemester() {
    const container = document.getElementById('cgpa-semesters');
    const semesterCount = container.children.length + 1;
    const semesterDiv = document.createElement('div');
    semesterDiv.className = 'semester-form';
    semesterDiv.innerHTML = `
        <h3>Semester ${semesterCount}</h3>
        <input type="number" step="0.01" placeholder="SGPA">
        <input type="number" placeholder="Credits">
        <button onclick="this.parentElement.remove()" style="background-color: #f44336; padding: 8px;">×</button>
    `;
    container.appendChild(semesterDiv);
}

function calculateCGPA() {
    const semesters = document.querySelectorAll('#cgpa-semesters .semester-form');
    let totalPoints = 0, totalCredits = 0;
    semesters.forEach(sem => {
        const sgpa = parseFloat(sem.querySelector('input[placeholder="SGPA"]').value) || 0;
        const credits = parseInt(sem.querySelector('input[placeholder="Credits"]').value) || 0;
        totalPoints += sgpa * credits;
        totalCredits += credits;
    });

    const prevCGPA = parseFloat(document.getElementById('previous-cgpa').value) || 0;
    const prevCredits = parseInt(document.getElementById('previous-credits').value) || 0;

    totalPoints += prevCGPA * prevCredits;
    totalCredits += prevCredits;

    const cgpa = totalCredits ? (totalPoints / totalCredits).toFixed(2) : 0;
    document.getElementById('cgpa-result').innerHTML = `CGPA: ${cgpa}<br>Total Credits: ${totalCredits}`;
}
