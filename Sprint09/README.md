## 🌕 SPRINT MISSION 8 (25 / 08 / 27)  
> **NB 2기 강시연**  

## 1️⃣ Jest & Supertest 기반 테스트 환경 설정

- **테스트용 DB 연결 및 초기화**
  - `setupTestDB` / `teardownTestDB` 함수 구현
  - Prisma 사용, 테스트 전후 데이터 삭제 및 시드 데이터 삽입
  - 외부 의존성 최소화 → 테스트 격리  

- **환경 설정**
  - `ts-jest`로 TypeScript 테스트 지원  
  - `supertest`로 Express API 테스트  
  - 테스트용 `.env.test` 분리 가능  


## 2️⃣ 테스트 코드 작성

- **인증 API**
  - 회원가입, 로그인, 잘못된 로그인 시도 테스트
  - `testUser` 활용  

- **게시글(Article) API**
  - 인증 필요 / 불필요 구분  
  - CRUD 기능 테스트
  - 댓글 작성 시 알림 연동 테스트 포함  

- **상품(Product) API**
  - CRUD 테스트  
  - 좋아요 / 가격 변경 시 알림 테스트  

- **테스트 구조**
  - `beforeAll` / `afterAll` / `beforeEach` 사용
  - JWT 토큰 발급 후 인증 헤더 설정  
  - 각 테스트 독립적 실행 가능  


## 3️⃣ 테스트 실행 결과 및 문제점

- **성공**
  - 일부 서비스 단위 테스트는 통과
- **실패**
  - `PrismaClientKnownRequestError`: 외래키 제약 조건 위반으로 `user.deleteMany()` 실패  
  - JWT 인증 헤더 누락 / testUser 미설정 문제로 401 발생  
  - 게시글, 상품 조회 시 404 오류  
- **해결 방향**
  - 테스트용 시드 데이터 정확히 삽입
  - 삭제 순서 조정 (`Comment / Article / Product → User`)
  - 테스트용 토큰 발급 로직 확실히  


## 4️⃣ 오늘 테스트 관련 주요 파일

- `tests/setup.ts` – 테스트 DB 초기화, 시드 삽입, teardown  
- `tests/article.test.ts` – Article API CRUD + 인증  
- `tests/product.test.ts` – Product API CRUD + 인증  
- `tests/auth.test.ts` – 회원가입, 로그인, 인증 실패 케이스  
