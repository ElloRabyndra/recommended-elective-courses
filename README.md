# 🎓 Recommended Elective Courses: Multi-Criteria Decision Support System

This project implements a web-based **Decision Support System (DSS)** designed to recommend the most suitable elective courses to students. The system operates on a **Multi-Criteria Decision Making (MCDM)** approach, allowing users to prioritize factors (criteria) to generate a personalized recommendation list.

## 🎯 Project Goal

To provide students with a personalized and objective tool to select elective courses by:

1. Allowing users to define the **relative importance (weights)** of various criteria (e.g., relevance, difficulty, workload, lecturer reputation).
2. Applying a structured calculation method (**Hybrid SWARA-SAW**) to generate a ranked list of available courses.
3. Displaying the final ranked recommendations through an intuitive web interface.

---

## 🧠 Core Methodology: Hybrid SWARA-SAW

The system's ranking logic is based on a **Hybrid SWARA-SAW** (Step-wise Weight Assessment Ratio Analysis and Simple Additive Weighting) approach. This combined method ensures that both **objective weights** (SWARA) and **normalized comparison** (SAW) are used to determine the best alternative.

1.  **SWARA (Weight Determination):**
    - Criteria are ranked based on their perceived importance (using a comparative value, $S_j$).
    - This method generates **objective final weights ($W_j$)** that reflect the hierarchical importance of the criteria, calculated directly from the user's input/rankings.
2.  **SAW (Ranking):**
    - The initial decision matrix ($X$) is **normalized ($R$)** by comparing the criteria values against the ideal maximum or minimum values (depending on the criterion type: **Benefit** or **Cost**).
    - The final **Preference Value ($V_i$)** for each course alternative is calculated by summing the product of the normalized value and the SWARA weight ($V_i = \sum W_j \times r_{ij}$).

---

## 📊 Data & Criteria

### Alternatives (Courses)

The system is configured to evaluate the following alternative elective courses:

- Machine Learning
- Data Science
- Pattern Recognition
- Database Management
- Computer Network Security
- Animation and Multimedia

### Decision Criteria Used for Ranking

The courses are evaluated based on the following criteria, with specific designation as Benefit (higher value is better) or Cost (lower value is better):

| Criterion                             | Description                                                           | Type    |
| :------------------------------------ | :-------------------------------------------------------------------- | :------ |
| **Relevance to Industry/Job Market**  | Measures applicability in the professional world.                     | Benefit |
| **Area of Interest / Specialization** | Measures alignment with the student's field of focus.                 | Benefit |
| **Curriculum Continuity**             | Measures how well the course integrates with previous/future studies. | Benefit |
| **Academic Prerequisites**            | Measures the number/difficulty of required prerequisite courses.      | Cost    |
| **Material Difficulty Level**         | Measures the inherent complexity of the course material.              | Cost    |

---

## 💻 Application Stack

This is a full-stack application leveraging modern web technologies:

| Layer        | Technology                   | Description                                                                                                                                    |
| :----------- | :--------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend** | React (Vite)                 | Provides the User Interface for inputting criteria weights and displaying the final recommendations.                                           |
| **Backend**  | Python (e.g., FastAPI/Flask) | Handles the core computational logic, including the **SWARA-SAW** calculation, receiving user inputs and returning the ranked list of courses. |

## ✨ Key Features

- **Customizable Weights:** Users can set weights for different decision criteria via the `InputBobot` component.
- **Real-time Ranking:** The backend processes the criteria and course alternatives to generate a ranked list instantly.
- **Interactive Interface:** Components for viewing alternative course details (`AlternatifPreview`) and the final recommendation list (`Rekomendasi`).

---

## 📁 Project Structure

```bash
recommended-elective-courses/
├── backend/
│   ├── main.py                 # Main application file (contains API endpoints and DSS SWARA-SAW calculation logic).
│   └── __pycache__/            # Python compiled files.
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AlternatifPreview.jsx # Component to display course alternatives.
│   │   │   ├── InputBobot.jsx        # User interface for setting criteria weights.
│   │   │   └── Rekomendasi.jsx       # Component for displaying the final ranked list.
│   │   ├── page/
│   │   │   └── Home.jsx              # Main application page.
│   │   └── service/
│   │       └── api.js              # Frontend logic for communicating with the backend API.
│   ├── package.json
│   ├── package-lock.json
│   └── ... (other standard frontend files)
└── README.md
```
