## 🌕 SPRINT MISSION 4 – 실시간 알림 기능 (25 / 08 / 19)  
> **NB 2기 강시연**  

## 기술  
- **언어**: TypeScript  
- **라이브러리/프레임워크**: Node.js, Express, PostgreSQL, Prisma, Socket.IO  
- **개발환경**: `ts-node`, `nodemon`, `dotenv`, `tsconfig`, `@types/express`  


## 🛠️ TypeScript & 레이어드 아키텍처  

- 기존 프로젝트 TypeScript로 전환, `any` 최소화 및 인터페이스/DTO 활용  
- `Controller`, `Service`, `Repository`로 계층 분리  
- 전역 타입 확장 (`req.user`)  
- 에러 핸들링 미들웨어 및 응답 포맷 통일  

## 🔔 알림 기능  

### 기능  
- 사용자는 자신의 **알림 목록 조회 가능**  
- 사용자는 **안 읽은 알림 개수 조회 가능**  
- 사용자는 **알림 읽음 처리 가능**  
- **클라이언트에서 실시간 알림 수신 가능 (Socket.IO)**  

### 알림 전송 조건  
- **좋아요한 상품 가격 변동 시 알림**  
- **내가 작성한 게시글에 댓글이 달릴 시 알림**  

### 구현 사항  
- **Notification 모델** 추가 (User와 sent/received 관계)  
- **NotificationRepository / NotificationService / NotificationController** 구현  
- Socket.IO로 유저별 room join 후 실시간 알림 전송  
- ProductService, CommentService에서 조건별 알림 생성 및 실시간 전송  


## 👥 기존 기능과 통합  

- **상품 CRUD**  
  - 등록, 수정, 삭제 시 권한 체크  
  - 가격 변동 시 실시간 알림 생성  
- **게시글 CRUD**  
  - 댓글 작성 시 게시글 작성자에게 알림 생성  
- **댓글 CRUD**  
  - 댓글 작성, 수정, 삭제 시 권한 체크  
  - 댓글 작성 시 실시간 알림 전송  
- **좋아요 기능**  
  - 상품/게시글 좋아요/취소  
  - 조회 시 `isLiked` 포함  


## 📦 데이터 모델 (ERD)

```mermaid
erDiagram
  User {
    Int id
    String email
    String nickname
    String image
    String password
    DateTime createdAt
    DateTime updatedAt
  }

  Product {
    Int id
    String name
    String description
    Float price
    String[] tags
    DateTime createdAt
    DateTime updatedAt
  }

  Article {
    Int id
    String title
    String content
    DateTime createdAt
    DateTime updatedAt
  }

  Comment {
    Int id
    String content
    DateTime createdAt
    DateTime updatedAt
  }

  Like {
    Int id
    DateTime createdAt
  }

  Notification {
    Int id
    String type
    String message
    Boolean isRead
    DateTime createdAt
    Int senderId
    Int receiverId
  }

  User ||--o{ Product : has
  User ||--o{ Article : has
  User ||--o{ Comment : has
  User ||--o{ Like : gives
  User ||--o{ Notification : sentNotifications
  User ||--o{ Notification : receivedNotifications

  Product }o--|| User : belongs_to
  Product ||--o{ Article : has
  Product ||--o{ Comment : has
  Product ||--o{ Like : has

  Article }o--|| User : belongs_to
  Article }o--|| Product : optional_belongs_to
  Article ||--o{ Comment : has
  Article ||--o{ Like : has

  Comment }o--|| User : belongs_to
  Comment }o--|| Article : optional_belongs_to
  Comment }o--|| Product : optional_belongs_to

  Like }o--|| User : by
  Like }o--|| Product : optional_target
  Like }o--|| Article : optional_target

  Notification }o--|| User : sender
  Notification }o--|| User : receiver
