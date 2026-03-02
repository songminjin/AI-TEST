# Blueprint: Festival Mission Dashboard (v4.0)

## 1. Overview

This document outlines the design and functionality for a mission tracking dashboard based *exclusively* on the provided user images. All previous versions and functionalities (like Firebase) are discarded. The primary goal is to create a pixel-perfect replica of the user's design with the specified data structure and logic.

**Core Principles:**
- The two user-provided images are the single source of truth.
- Data is managed simply via the browser's `localStorage`.
- The application is visually and functionally identical to the mockups.

---

## 2. Screen Design & Layout

### 2.1. Main Page (`index.html` - Based on Image 1)

- **Header:**
    - Title: "페스티벌"
    - Buttons: "수정", "초기화"

- **Layout (3 Columns):**
    - **Column 1 (Left):**
        - Card: "오늘 활동 현황" (`단순`, `유효`, `침례`, `출석`)
        - Card: "누적 활동 현황" (`단순`, `유효`, `침례`, `출석`)
    - **Column 2 (Center):**
        - Card: "누적점수"
        - Card: "빙고 미션" (A 4x4 grid labeled `미션1` through `미션16`)
    - **Column 3 (Right):**
        - Card: "누적서신"
        - Card: "미션내용" (A two-column list of missions with progress bars)

### 2.2. Edit Page (`edit.html` - Based on Image 2)

- **Header:**
    - Title: "수정페이지"
    - Buttons: "메인화면", "저장"

- **Layout (2 Columns):**
    - **Column 1 (Left):**
        - Card: "오늘 활동 현황" (`단순`, `유효`, `침례`, `출석`, `온라인`) with `+` and `-` controls.
        - Card: "오늘 교육 현황" (`프리칭`, `엘카`, `새성도`, `온라인`) with `+` and `-` controls.
    - **Column 2 (Right):**
        - Card: A two-column grid of "미션 내용" items. Each item has a title, a progress bar, the current/goal value, and `+`/`-` controls.

---

## 3. Data Structure (`localStorage` key: `festivalData`)

```json
{
  "activityStatus": {
    "today": {"simple": 0, "valid": 0, "baptism": 0, "attendance": 0, "online": 0},
    "total": {"simple": 0, "valid": 0, "baptism": 0, "attendance": 0, "online": 0}
  },
  "educationStatus": {
    "today": {"preaching": 0, "elca": 0, "newBeliever": 0, "onlineEdu": 0}
  },
  "missions": [
    {"id": 0, "title": "미션 내용", "current": 6, "goal": 10},
    {"id": 1, "title": "미션 내용", "current": 6, "goal": 10},
    // ... (12 missions in total for the list)
  ],
  "bingoCompleted": [false, false, ...], // 16 boolean values
  "letterCount": 0,
  "totalScore": 0
}
```

---

## 4. Action Plan

1.  **`blueprint.md` Update:** (Completed) Create a new design specification that strictly adheres to the images.
2.  **HTML Scaffolding:** Re-write `index.html` and `edit.html` from scratch to match the static structure and content shown in the images.
3.  **CSS Styling:** Re-write `style.css` and `edit.css` to match the visual design (colors, fonts, layout, gradients, shadows) of the images.
4.  **`main.js` Implementation:**
    - Define the `initialData` object based on the new data structure.
    - Load from `localStorage` on start, or create `initialData` if it doesn't exist.
    - Write a `render()` function to populate the data into the static `index.html` elements.
    - Implement the `초기화` (Reset) button functionality.
5.  **`edit.js` Implementation:**
    - Load data from `localStorage`.
    - Write a `render()` function to populate the `edit.html` forms.
    - Implement `+` and `-` button functionality.
    - Implement the `저장` (Save) button logic:
        - Read all values from the edit page controls.
        - Update the `today` values.
        - **Crucially, add the new `today` values to the `total` values.**
        - Update mission progress.
        - Save the complete data object back to `localStorage`.
        - Redirect to `index.html`.
