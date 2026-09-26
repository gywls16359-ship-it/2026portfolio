# PORTFOLIO WEBSITE SPECIFICATION

> 목적: Figma MCP + 로컬 이미지 에셋을 바탕으로 HTML / CSS / Vanilla JavaScript만 사용해 반응형 포트폴리오 사이트를 구현한다.  
> 1차 구현 범위는 **정적 UI + 반응형 + 네비게이션 + 프로젝트 전환 + 상세 모달**이다.  
> 애니메이션은 1차 구현에서 제외하고, 사이트 기본 구조가 안정된 뒤 별도 단계에서 추가한다.

---

# 01. Project Overview

## Site Structure

- MAIN
- PROFILE
- GRAPHIC
- UI/UX
- PUBLISHING
- CONTACT

전체 사이트는 하나의 `index.html` 안에서 세로 스크롤로 연결한다.

## Development Stack

- HTML
- CSS
- Vanilla JavaScript

### 사용하지 않음

- React
- Vue
- jQuery
- GSAP
- 기타 애니메이션 라이브러리
- `data.js` 기반 프로젝트 데이터 렌더링

프로젝트의 실제 텍스트, 이미지, 링크는 `index.html`에 직접 작성한다.  
JavaScript는 **동작만 담당**한다.

---

# 02. AI Coding Rules

1. Figma MCP는 레이아웃, 위치, 크기, 간격, 디자인 참고용으로 사용한다.
2. 실제 웹사이트 이미지는 `assets/` 내부에 사용자가 제공한 파일을 사용한다.
3. 이미지 파일을 AI가 임의로 재생성하거나 변환하지 않는다.
4. 이미지 파일명과 경로를 임의로 변경하지 않는다.
5. Figma와 본 명세가 충돌할 경우 `PORTFOLIO_SPEC.md`를 우선한다.
6. 디자인 개선을 이유로 명세에 없는 UI 요소를 임의로 추가하지 않는다.
7. 프로젝트 콘텐츠를 JavaScript 객체로 재구성하지 않는다.
8. CSS 파일 구조를 임의로 합치거나 변경하지 않는다.
9. 1차 구현 단계에서는 Scroll Animation, Fade Animation, Text Animation, Progress Animation을 추가하지 않는다.
10. Hover는 명세에 적힌 기본적인 인터랙션만 구현한다.

---

# 03. Final File Structure

```text
portfolio/
│
├── index.html
├── PORTFOLIO_SPEC.md
│
├── css/
│   ├── reset.css
│   ├── global.css
│   ├── common.css
│   ├── main.css
│   ├── profile.css
│   ├── graphic.css
│   ├── uiux.css
│   ├── publishing.css
│   ├── contact.css
│   └── responsive.css
│
├── js/
│   ├── common.js
│   ├── project-nav.js
│   └── modal.js
│
└── assets/
    ├── images/
    │   ├── common/
    │   ├── main/
    │   ├── profile/
    │   ├── graphic/
    │   ├── uiux/
    │   ├── publishing/
    │   └── decoration/
    │
    └── icons/
```

## CSS Load Order

```html
<link rel="stylesheet" href="./css/reset.css">
<link rel="stylesheet" href="./css/global.css">
<link rel="stylesheet" href="./css/common.css">

<link rel="stylesheet" href="./css/main.css">
<link rel="stylesheet" href="./css/profile.css">
<link rel="stylesheet" href="./css/graphic.css">
<link rel="stylesheet" href="./css/uiux.css">
<link rel="stylesheet" href="./css/publishing.css">
<link rel="stylesheet" href="./css/contact.css">

<link rel="stylesheet" href="./css/responsive.css">
```

`responsive.css`는 항상 마지막에 불러온다.

---

# 04. Figma MCP

## Figma References

아래 항목은 실제 작업 전 Figma의 `Copy link to selection` 링크로 교체한다.

```text
MAIN:
TODO

PROFILE:
TODO

GRAPHIC:
TODO

UI/UX - 서울공예박물관:
TODO

UI/UX - 번개장터:
TODO

UI/UX - 헤이엄:
TODO

UI/UX - TIMO:
TODO

PUBLISHING - 앤커프라임:
TODO

PUBLISHING - 설빙:
TODO

PUBLISHING - 제주비건:
TODO

CONTACT:
TODO
```

Figma MCP는 디자인 참고용이며, 웹에서 사용하는 실제 이미지는 로컬 `assets/` 파일을 우선한다.

---

# 05. Global Design System

## Fonts

### Pretendard

사용 영역:
- Navigation
- UI 카테고리명
- Graphic 텍스트
- 버튼
- Footer
- 공통 UI

### S-Core Dream

사용 영역:
- 프로젝트 메인 타이틀
- Profile 정보
- 학력 / 교육 / 수상·전시
- Contact 메인 타이틀
- 프로젝트 정보 텍스트

Weight:
- 3Light → 300
- 4Regular → 400
- 5Medium → 500
- 6Bold → 해당 제공 폰트의 Bold weight 사용

### Kyobo Handwriting 2025

사용 영역:
- PROFILE
- Profile 키워드
- 프로젝트 소설명
- Contact 소개 문장
- Contact 정보 값
- 손글씨 성격의 일부 MAIN 요소

폰트는 제공된 CDN 또는 프로젝트용 폰트 연결 방식을 사용하며 임의의 대체 폰트로 교체하지 않는다.

---

# 06. Global Colors

```css
:root {
  --color-black: #202020;
  --color-nav: #3B3B3B;
  --color-main-blue: #336DFF;
  --color-subtext: #3D3D3D;
  --color-white: #FFFFFF;

  --color-skill-blue: #4E51FF;
  --color-skill-track: #D9D9D9;

  --color-seoul-craft: #3B0000;
  --color-bunjang: #B50000;
  --color-heyum: #0C9AD7;
  --color-timo-primary: #00B5A6;
  --color-timo-secondary: #3A3DFF;

  --color-ankerprime: #3A3DFF;
  --color-sulbing: #FF4B4B;
  --color-jeju-vegan: #25580A;

  --bg-ankerprime: #CFEBFF;
  --bg-sulbing: #FFEEEE;
  --bg-jeju-vegan: #D5FFE7;

  --bottom-nav-height: 114px;
  --point-line-width: 162px;
  --point-line-height: 6px;
}
```

---

# 07. Global Background

## MAIN / PROFILE / GRAPHIC

- 준비된 종이 질감 이미지를 사용한다.
- Image opacity: `100%`
- MAIN → PROFILE → GRAPHIC은 동일한 배경 질감 흐름을 유지한다.

## UI/UX

- 준비된 종이 질감 이미지를 사용한다.
- Image opacity: `100%`

## PUBLISHING

프로젝트별 Background Color 위에 동일한 종이 질감 이미지를 별도 레이어로 겹친다.

### Texture

- Image opacity: `58%`
- 콘텐츠 opacity에는 영향을 주지 않는다.

### 앤커프라임

- Background: `#CFEBFF`
- Color opacity: `100%`

### 설빙

- Background: `#FFEEEE`
- Color opacity: `100%`

### 제주비건

- Background: `#D5FFE7`
- Color opacity: `100%`

Publishing에서 section 자체에 `opacity`를 주지 않는다.

```text
Project Section
├── Background Color
├── Texture Layer (58%)
└── Content Layer (100%)
```

## CONTACT

CONTACT의 배경은 Figma MCP의 최종 디자인을 기준으로 구현하며 별도 override가 없으면 기존 종이 질감 흐름을 유지한다.

---

# 08. Global Navigation

## Desktop / Tablet

Navigation은 사이트 진입 순간부터 CONTACT까지 계속 표시한다.

- `position: fixed`
- `top: 0`
- `left: 0`
- `width: 100%`
- 높은 `z-index`
- Glass effect 사용
- 밝은 반투명 배경
- `backdrop-filter: blur(...)`

Menu:
- Profile
- Graphic
- UI/UX
- Publishing
- Contact

### Default

- Color: `#3B3B3B`

### Hover

- Color: `#336DFF`
- Font weight를 한 단계 증가
- 글자 크기는 변경하지 않는다.
- 레이아웃이 흔들리지 않도록 메뉴 영역의 폭을 안정적으로 유지한다.

### Active

- 현재 보고 있는 Section의 메뉴를 `#336DFF`
- Hover와 동일한 방향으로 굵기를 증가
- 별도의 underline / box background는 사용하지 않는다.

Navigation 클릭 시 해당 Section으로 이동한다.  
Fixed Navigation 높이를 고려해 scroll offset을 적용한다.

## Mobile

Breakpoint: `768px 이하`

- Desktop 5개 메뉴는 숨긴다.
- Fixed Glass Header는 유지한다.
- Hamburger Menu로 변경한다.
- 1차 구현에서는 메뉴 열림/닫힘 Animation을 넣지 않는다.
- 메뉴 클릭 시 해당 Section으로 이동한 뒤 Menu를 닫는다.

---

# 09. MAIN

MAIN은 최종 확정된 Figma 프레임을 가장 우선하여 구현한다.

> 웹 구현에서는 화면용 타이포이므로 `pt`가 아니라 `px` 단위로 적용한다.  
> 아래 22pt / 48pt 값은 각각 `22px` / `48px`로 구현한다.

## Layout

Left:
1. `2026 PORTFOLIO`
2. `UI / UX DESIGNER & WEB PUBLISHER`
3. `SEO HYO JIN`
4. 소개 문장

Right:
- Word Search Graphic

Bottom center:
- `Scroll to explore`
- Down Arrow

## Main Base Color

- 가장 어두운 Black: `#202020`

## 2026 PORTFOLIO

- Text: `2026 PORTFOLIO`
- Font-family: `Kyobo Handwriting 2025`
- Font-size: `22px`
- Letter-spacing: `-0.04em`
- Color: `#262626`

## Role Title

```text
UI / UX DESIGNER
& WEB PUBLISHER
```

- Font-family: `S-Core Dream`
- Font-size: `48px`
- Line-height: `51px`
- Letter-spacing: `-0.04em`
- Color: `#336DFF`

## Name

`SEO HYO JIN`

- Font-family: `S-Core Dream`
- Font-size: `32px`
- Line-height: `65px`
- Letter-spacing: `-0.04em`
- Color: `#202020`

## Intro Copy

전체 문장:

```text
사용자의 경험과 브랜드의 가치를
연결하기 위해 끊임없이 고민하는
“UI/UX 디자이너 서효진”입니다.
```

### Base Intro Style

- Font-family: `S-Core Dream`
- Font-weight: `300 / 3Light`
- Font-size: `22px`
- Line-height: `40px`
- Letter-spacing: `-0.04em`
- Color: `#202020`

### Emphasis

강조 단어:
- `사용자의 경험`
- `브랜드의 가치`

Style:
- Font-family: `S-Core Dream`
- Font-weight: `500 / 5Medium`
- Font-size: `22px`
- Line-height: `40px`
- Letter-spacing: `-0.04em`
- Color: `#202020`

`“UI/UX 디자이너 서효진”` 강조 컬러는 최종 Figma 프레임을 우선하며, 현재 시안처럼 Main Blue를 사용할 경우 `#336DFF`를 적용한다.

## Right Word Search

현재 최종 디자인의:
- WEB
- PUBLISH
- DESIGN
- UIUX
- PORTFOLIO

### Letter Typography

- Font-family: `AppleSDGothicNeoEB00`
- Font-size: `25px`
- Line-height: `50px`
- Letter-spacing: `-10px`
- 기본 글자색: `#202020`
- 강조 글자색: `#336DFF`

### Highlight Line / Capsule

워드서치 위에 겹치는 파란색 라인은 둥근 캡슐 형태의 Outline Component로 구현한다.

기본 규격:
- Width: `45.6px`
- Height: `257.34px`
- Border-radius: `100%`
- Color: `#336DFF`
- Fill 없이 outline 형태

각 단어 방향에 따라 해당 요소를 회전하거나 길이를 조정하되,
최종 배치와 각도는 Figma MCP의 MAIN 프레임을 우선한다.

강조 선과 알파벳 배치는 최종 Figma 디자인을 그대로 참고한다.

## Scroll Cue

`Scroll to explore`

- Font-family: `Kyobo Handwriting 2025`
- Font-size: `20px`
- Letter-spacing: `-0.04em`
- Color: `#336DFF`
- 하단 중앙 배치
- Down Arrow 함께 배치
- 1차 구현에서는 별도 Animation 없음

---

# 10. PROFILE

## Layout

Desktop:

```text
┌──────────────┬──────────────────────────────┐
│              │           SKILLS             │
│   PROFILE    ├──────────────┬───────────────┤
│   PHOTO      │    학력       │ 수상 · 전시    │
│   INFO       │    교육       │               │
└──────────────┴──────────────┴───────────────┘
```

## Left Profile Area

### Kyobo Handwriting 2025

적용:
- `PROFILE`
- `#친절함`
- `#섬세함`
- `#열정적`

### Profile Information

적용:
- 서효진
- 2002.11.15
- 010-7635-8980
- iiseoiiu@naver.com

Style:
- Font: S-Core Dream
- Size: `25px`
- Line-height: `25px`
- Color: `#202020`

## Skills

### Skill Names

- Photoshop
- Figma
- HTML · CSS
- JavaScript
- Vibe Coding

Style:
- Pretendard Bold
- `12px`

### Percent

- Pretendard
- `16px`

### Progress

- Active: `#4E51FF`
- Empty Track: `#D9D9D9`
- 1차 구현에서는 Progress Animation 없음

### Additional Skills

아이콘 예:
- ChatGPT
- GitHub
- SVG
- GSAP
- Sass
- Tailwind CSS
- Bootstrap

실제 제공된 아이콘 파일을 사용한다.

## 학력 / 교육 / 수상·전시 경력 Title

- Font: S-Core Dream 3Light
- Size: `25px`
- Line-height: `40px`

## 학력

```text
2017.03 ~ 2020.12
숭신여자고등학교 졸업

2021.03 ~ 2025.02
수원대학교 공예디자인과 졸업
```

Style:
- S-Core Dream 3Light
- `16px`
- Line-height: `30px`
- Letter-spacing: `-0.07em`

Date:
- `#336DFF`

School:
- `#202020`

## 교육

### Date

`2026.03 ~ 2026.07`

- S-Core Dream 3Light
- `16px`
- Line-height: `30px`
- Letter-spacing: `-0.07em`
- Color: `#336DFF`

### Institution

`이젠아카데미 DX교육센터`

- S-Core Dream 4Regular
- `16px`
- Line-height: `30px`
- Letter-spacing: `-0.07em`
- Color: `#202020`

### Detail

```text
UX/UI AI 툴셋 활용 웹서비스
기획 · 디자인 & 퍼블리싱(바이브코딩)
```

- S-Core Dream 3Light
- 기관명보다 보조 위계
- 정확한 size는 Figma MCP 기준

날짜 / 기관명 / 설명이 같은 위계로 보이지 않도록 한다.

## 수상 · 전시 경력

### Year

`2024~`, `2025~`

- S-Core Dream 5Medium
- `16px`
- Line-height: `40px`
- Letter-spacing: `-0.07em`
- Color: `#336DFF`

### Month

- S-Core Dream 4Regular
- `16px`
- Line-height: `30px`
- Letter-spacing: `-0.07em`

### Description

- S-Core Dream 3Light
- `16px`
- Line-height: `30px`
- Letter-spacing: `-0.07em`

월 영역은 고정 width로 맞춰 설명 시작점이 동일하도록 한다.

---

# 11. GRAPHIC

## Section Title

`GRAPHIC DESIGN`

- Pretendard Regular
- `28px`
- Color: `#336DFF`

## Gallery

- 가로형 Graphic Gallery
- 작품별 Image + Category + Title
- 자동 슬라이드 없음
- 1차 Animation 없음
- Desktop에서는 horizontal scroll
- Mobile에서는 swipe
- Scroll snap 사용 가능
- 기본 scrollbar는 노출하지 않는다.

## Category

예: `AI Design`

- Pretendard Regular
- `18px`
- Letter-spacing: `0`
- Color: `#505050`

## Project Title

예: `크로캉부슈 광고`

- Pretendard Regular
- `20px`
- Letter-spacing: `0`
- Color: `#323232`

## Image Hover

- 이미지 위에 `#202020` 50% Overlay
- 이미지 자체 opacity를 낮추지 않는다.
- 이미지 크기 / 위치 변화 없음
- Hover용 추가 텍스트 / 아이콘 / View UI는 추후 사용자가 직접 추가 가능

## Detail

작품 Thumbnail 클릭 시 공통 Detail Modal을 연다.  
추후 `View` 버튼을 추가할 경우 동일한 Modal을 호출한다.

---

# 12. UI/UX

## Projects

1. 서울공예박물관
2. 번개장터
3. 헤이엄
4. TIMO

## Accent Colors

- 서울공예박물관: `#3B0000`
- 번개장터: `#B50000`
- 헤이엄: `#0C9AD7`
- TIMO Primary: `#00B5A6`
- TIMO Secondary: `#3A3DFF`

## Project Structure

각 프로젝트는 독립적인 `project-panel`로 세로 배치한다.

```text
서울공예박물관
↓
번개장터
↓
헤이엄
↓
TIMO
```

Desktop에서는 각 Project Panel을 한 화면 단위에 가깝게 구성하되 `height:100vh`로 강제하지 않는다.  
기본적으로 `min-height`를 사용한다.

## Project Switching

두 방식 모두 지원:

### Scroll

- 스크롤 위치에 따라 Active Project 감지
- Active Project에 맞춰 Bottom Navigation 상태 변경

### Bottom Navigation Click

- Project 이름 클릭 시 해당 Project Panel 위치로 이동
- 텍스트 자체만 클릭 영역으로 잡지 않는다.

## Category

`UI / UX DESIGN`

- Pretendard Light
- `28px`
- 프로젝트 Accent Color

## Main Title

- S-Core Dream 6Bold
- `60px`
- Line-height: `72px`
- 프로젝트 Accent Color

## Subtitle

예:
`Mobile Web | UI/UX design`

- Kyobo Handwriting 2025
- `21px`
- Letter-spacing: `0.1em`
- Color: `#3D3D3D`

## Meta Label

`Period / Role / Tool`

- S-Core Dream 4Regular
- `18px`
- Color: `#202020`

## Meta Value

- S-Core Dream 3Light
- `18px`
- Color: `#202020`

### `100% Personal`

- S-Core Dream 5Medium
- `18px`
- Color: `#202020`

## Buttons

- `View`
- `Figma`
- `Site`
- `Github` (TIMO만 추가)

Style:
- Pretendard Regular
- `20px`
- Line-height: `24px`

### Function

- View → Detail Modal
- Figma → 새 탭
- Site → 새 탭
- Github → 새 탭

UI/UX 프로젝트:
- 서울공예박물관: View / Figma / Site
- 번개장터: View / Figma / Site
- 헤이엄: View / Figma / Site
- TIMO: View / Figma / Site / Github

---

# 13. PUBLISHING

## Projects

1. 앤커프라임
2. 설빙
3. 제주비건

## Accent Colors

- 앤커프라임: `#3A3DFF`
- 설빙: `#FF4B4B`
- 제주비건: `#25580A`

## Typography

UI/UX와 동일한 Typography System을 사용한다.

### Category

`PUBLISHING`

- Pretendard Light
- `28px`
- 프로젝트 Accent Color

### Main Title

- S-Core Dream 6Bold
- `60px`
- Line-height: `72px`
- 프로젝트 Accent Color

### Subtitle

- Kyobo Handwriting 2025
- `21px`
- Letter-spacing: `0.1em`
- Color: `#3D3D3D`

### Meta Label

- S-Core Dream 4Regular
- `18px`
- Color: `#202020`

### Meta Value

- S-Core Dream 3Light
- `18px`
- Color: `#202020`

### Personal / Team Emphasis

`100% Personal`
- S-Core Dream 5Medium
- `18px`

`Team`
- S-Core Dream 5Medium
- `18px`

Team 역할 설명:
- S-Core Dream 3Light
- `18px`

## Buttons

모든 Publishing Project:
- View
- Figma
- Site
- Github

View만 Modal을 열고, 나머지는 새 탭 링크로 이동한다.

---

# 14. Bottom Fixed Project Navigation

UI/UX와 PUBLISHING에서만 사용한다.

## Visibility

- MAIN → 숨김
- PROFILE → 숨김
- GRAPHIC → 숨김
- UI/UX → 표시
- PUBLISHING → 표시
- CONTACT → 숨김
- Mobile `768px 이하` → 숨김

## Container

- `position: fixed`
- `bottom: 0`
- `left: 0`
- `width: 100%`
- `height: 114px`
- Background: `rgba(0,0,0,0.65)`
- Glass / backdrop blur 적용

## Text

Active:
- Pretendard Bold
- `20px`
- Color: `#FFFFFF`

Inactive:
- Pretendard Regular
- `20px`
- Color: `#FFFFFF`

## Click Area

각 Project Item:
- Width: `162px`
- Height: `114px`
- 전체 영역을 Click / Hover Area로 사용
- 텍스트만 클릭해야 하는 구조 금지

## Base Line

- Color: `#FFFFFF`

## Active Point Line

- Width: `162px`
- Height: `6px`
- Border-radius: `999px`
- 프로젝트 Accent Color
- 양 끝은 둥근 Pill 형태

Fixed Bottom Nav 때문에 콘텐츠가 가려지지 않도록 Project Panel에 필요한 bottom spacing을 확보한다.

---

# 15. CONTACT

## Main Title

`Contact`

- S-Core Dream Bold
- `106px`
- Line-height: `114px`
- Color: `#336DFF`

## Description

- Kyobo Handwriting 2025
- `30px`
- Line-height: `34px`
- Letter-spacing: `-0.04em`
- Color: `#202020`

Title / Description Gap:
- `32px`

## Labels

- `[ name ]`
- `[ email ]`
- `[ number ]`

Style:
- S-Core Dream 3Light
- `36px`
- Color: `#202020`

## Values

- 서효진
- iiseoiiu@naver.com
- 010-7635-8980

Style:
- Kyobo Handwriting 2025
- `48px`
- Line-height: `54px`
- Color: `#202020`

Email:
- `mailto:` 링크

Phone:
- 모바일에서 `tel:` 링크

## Divider Line

- Base Color: `#53AACF`
- Opacity: `50%`

## GitHub Icon

- Width: `41px`
- Height: `41px`
- 전체 영역 클릭 가능
- 새 탭

---

# 16. Footer

## Container

- Width: `100%`
- Height: `166px`

## Top Line

- `border-top`
- `border-style: dotted`
- Color: `#336DFF`
- 실제 두께는 Figma 디자인에 맞춰 조정

## Notice

`본 포트폴리오는 100% 직접 제작하였으며, 비상업적 개인 프로젝트임을 밝힙니다.`

- Pretendard Medium
- `16px`
- Color: `#202020`

## Copyright

`Copyright 2026 hyojin seo All Rights Reserved.`

- Pretendard Regular
- `14px`
- Color: `#767676`

---

# 17. Global Detail Modal

Graphic / UI/UX / Publishing 공통 Modal 하나만 사용한다.

## Content

- 프로젝트당 세로형 Detail Image 1장
- Detail Image는 기본적으로 SVG 파일 사용
- SVG 용량이나 브라우저 렌더링 문제가 있는 경우 사용자가 직접 다른 형식으로 교체 가능
- AI가 임의 변환하지 않는다.

## Open

- View 또는 연결된 Thumbnail 클릭
- Modal Open 시 body scroll lock

## Close

- `X`
- ESC
- Overlay click

Modal Close 후 기존 페이지 Scroll Position을 유지한다.

## Overlay

- `rgba(32,32,32,0.80)`
- Blur 없음

## Desktop

- Detail Image 중심 정렬
- 시작 기준 max-width: 약 `1280px`
- Close Button은 브라우저 우측 상단이 아니라 Detail Image의 오른쪽 바깥 상단
- `←`, `→` Arrow는 이미지 좌우 바깥 / viewport 중앙
- Controls는 이미지 Scroll과 관계없이 사용할 수 있도록 fixed

## Previous / Next

텍스트 사용 금지.

- Previous → `←`
- Next → `→`

같은 Category 내부에서만 이동한다.

```text
Graphic ↔ Graphic
UI/UX ↔ UI/UX
Publishing ↔ Publishing
```

- 프로젝트 변경 시 Modal Scroll을 Top으로 초기화
- 첫 프로젝트는 Prev 숨김
- 마지막 프로젝트는 Next 숨김

## Mobile

- Detail Image: `width:100%`
- Side Arrow 사용 안 함
- 하단에 Fixed Arrow Control 배치

```text
[ ← ]                       [ → ]
```

화살표만 표시하되 실제 Touch Area는 최소 `44 × 44px` 이상 확보한다.

Close Button은 이미지의 오른쪽 상단 경계에 맞춰 배치한다.

---

# 18. Responsive Rules

## Breakpoints

```text
Desktop: 1201px 이상
Tablet: 769px ~ 1200px
Mobile: 768px 이하
```

## Desktop

- Figma Desktop Design을 기준으로 구현
- UI/UX / Publishing 2-column 구조
- Bottom Project Navigation Fixed
- Contact 2-column
- Graphic horizontal gallery

## Tablet

- 기본 Desktop Layout을 최대한 유지
- 필요 시 Title / Image / Spacing을 축소
- Bottom Project Navigation 유지

## Mobile

### Global

- Fixed Glass Navigation → Hamburger
- Bottom Project Navigation 숨김

### PROFILE

세로 배치:

```text
PROFILE
Photo
Info
Keywords
Skills
학력
교육
수상·전시
```

### GRAPHIC

- Horizontal swipe
- 이미지와 텍스트가 읽기 쉬운 크기로 조정

### UI/UX / PUBLISHING

Bottom Nav 없이 자연스러운 세로 Scroll:

```text
Project 1
↓
Project 2
↓
Project 3
...
```

Project Panel에 `height:100vh`를 강제하지 않는다.

### CONTACT

2-column → Single column

### MODAL

- Full-width Detail Image
- 하단 Arrow Control
- Side Arrow 제거

---

# 19. Image Asset Rules

## General

- 제공된 이미지 파일을 그대로 사용한다.
- AI가 확장자를 임의 변환하지 않는다.
- AI가 이미지를 새로 생성하지 않는다.
- 파일명 / 경로를 임의 변경하지 않는다.

## Graphic

파일명은 단순하게 관리한다.

```text
graphic1.*
graphic1-detail.svg

graphic2.*
graphic2-detail.svg

graphic3.*
graphic3-detail.svg

graphic4.*
graphic4-detail.svg

graphic5.*
graphic5-detail.svg
```

HTML 주석과 `alt`에는 실제 작품명을 명시한다.

## UI/UX

```text
seoul-craft.*
seoul-craft-detail.svg

bunjang.*
bunjang-detail.svg

heyum.*
heyum-detail.svg

timo.*
timo-detail.svg
```

## Publishing

```text
ankerprime.*
ankerprime-detail.svg

sulbing.*
sulbing-detail.svg

jeju-vegan.*
jeju-vegan-detail.svg
```

`.*`는 사용자가 실제로 제공한 PNG / JPG / SVG 등의 확장자를 그대로 사용한다는 의미이며 AI가 확장자를 추측하지 않는다.

---

# 20. External Links

실제 URL은 코딩 시작 전 입력한다.

```text
SEOUL CRAFT
Figma:
Site:

BUNJANG
Figma:
Site:

HEYUM
Figma:
Site:

TIMO
Figma:
Site:
Github:

ANKERPRIME
Figma:
Site:
Github:

SULBING
Figma:
Site:
Github:

JEJU VEGAN
Figma:
Site:
Github:
```

## Link Rules

### View

- `<button>`
- Detail Modal open

### Figma / Site / Github

- `<a>`
- `target="_blank"`
- `rel="noopener noreferrer"`

링크가 없는 버튼은 `href="#"`로 만들지 않고 출력하지 않는다.

---

# 21. JavaScript Responsibilities

## common.js

- Global Fixed Navigation
- Navigation Click
- Active Section 감지
- Mobile Hamburger Open / Close

## project-nav.js

- UI/UX Bottom Nav
- Publishing Bottom Nav
- Scroll Position 기반 Active Project 감지
- Bottom Nav Click → Project 이동
- UI/UX / Publishing Section 진입 시 해당 Nav 표시
- 나머지 Section에서는 숨김
- Mobile에서는 숨김

## modal.js

- Detail Modal Open / Close
- `data-detail` 경로 읽기
- Detail Image 교체
- X
- Overlay click
- ESC
- `←` / `→`
- Category 내부 Previous / Next
- Body Scroll Lock
- Modal 변경 시 Scroll Top 초기화

## 금지

- `data.js`
- `animation.js`
- GSAP
- 프로젝트 콘텐츠 JS 렌더링

---

# 22. HTML Naming Rules

프로젝트명과 이미지 이름을 최대한 동일하게 통일한다.

예:

```text
ID       seoul-craft
CLASS    .seoul-craft
IMAGE    seoul-craft.png
DETAIL   seoul-craft-detail.svg
```

Recommended Common Classes:

```text
.project-panel
.project-inner
.project-info
.project-category
.project-title
.project-subtitle
.project-meta
.project-links
.project-btn
.project-visual

.view-btn

.project-bottom-nav
.bottom-nav-item
.point-line

.detail-modal
.modal-overlay
.modal-viewer
.modal-close
.modal-prev
.modal-next
.modal-content
.modal-image
```

---

# 23. Phase 1 Completion Criteria

1차 구현 완료 기준:

- Desktop Layout 구현
- Tablet / Mobile Responsive 구현
- Fixed Global Navigation
- Mobile Hamburger
- Graphic Hover
- UI/UX Scroll Project Switching
- Publishing Scroll Project Switching
- Desktop / Tablet Bottom Fixed Project Navigation
- Mobile Bottom Project Navigation 제거
- View Detail Modal
- Modal Previous / Next
- Figma / Site / Github External Links
- Contact mailto / tel
- Footer 구현

아래는 2차 단계:

- Scroll Animation
- Text Animation
- Word Search Drawing Animation
- Progress Animation
- 기타 Motion / Micro Interaction
