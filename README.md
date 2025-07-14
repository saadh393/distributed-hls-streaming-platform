# Video Streaming Platform - Microservices Architecture

A scalable Node.js video streaming platform built with microservices architecture for practicing advanced Node.js concepts, system design, and distributed systems.

## 🎯 Project Overview

This is a practice project designed to understand and implement:

- **Microservices Architecture** with Node.js
- **System Design** for video streaming platforms
- **Node.js Multi-threading** and worker processes
- **Video Streaming** with HLS (HTTP Live Streaming)
- **Queue Messaging** with BullMQ and Redis
- **File Upload** with chunked/resumable uploads
- **Video Transcoding** with FFmpeg
- **Docker Containerization** and orchestration

## 🏗️ Architecture Design

### Service Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │────│  Upload Service │────│ Storage Service │
│     (3000)      │    │     (3001)      │    │     (3002)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │ Transcode Queue │────│Transcode Service│
                       │   (Redis/Bull)  │    │     (3003)      │
                       └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │Streaming Service│
                       │     (3004)      │
                       └─────────────────┘
```

### Data Flow

1. **Upload Flow**: Client → API Gateway → Upload Service → Storage Service
2. **Processing Flow**: Upload Service → Queue → Transcode Service → Storage Service
3. **Streaming Flow**: Client → API Gateway → Streaming Service → HLS Player

## 🛠️ Tech Stack

### Backend Services

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Queue System**: BullMQ with Redis
- **Database**: Redis (for queue and caching)
- **Storage**: MinIO (S3-compatible object storage)
- **Video Processing**: FFmpeg
- **Containerization**: Docker & Docker Compose

### Development Tools

- **Process Manager**: Nodemon with ts-node-dev
- **Type Safety**: TypeScript
- **Code Quality**: ESLint, Prettier
- **File Watching**: Chokidar

### Infrastructure

- **Reverse Proxy**: API Gateway (Express.js)
- **Message Queue**: Redis with BullMQ
- **Object Storage**: MinIO
- **Container Orchestration**: Docker Compose

## 📁 Project Structure

```
video-streaming-platform/
├── api-gateway/           # API Gateway service (Port 3000)
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── upload-service/        # File upload service (Port 3001)
│   ├── src/
│   │   ├── api/controllers/
│   │   ├── worker/        # BullMQ workers
│   │   ├── config/        # Redis, MinIO config
│   │   └── utils/
│   ├── Dockerfile
│   └── package.json
├── storage-service/       # File storage service (Port 3002)
├── transcode-service/     # Video transcoding service (Port 3003)
├── streaming-service/     # HLS streaming service (Port 3004)
├── min-io/               # MinIO data directory
└── docker-compose.yml    # Container orchestration
```

## 🚀 Current Progress

### ✅ Completed Features

- [x] **Docker Environment Setup**

  - Multi-service Docker Compose configuration
  - Redis container with redis-stack
  - MinIO object storage setup
  - Development environment with hot reload

- [x] **Upload Service Implementation**

  - Chunked file upload with resumable uploads
  - File metadata management
  - Chunk validation and completion detection
  - File assembly and storage

- [x] **Queue System Integration**

  - BullMQ integration with Redis
  - Video processing job queue
  - Worker processes for background tasks
  - Job status tracking and error handling

- [x] **Storage Integration**

  - MinIO client configuration
  - File upload to object storage
  - Automatic cleanup of temporary files
  - Bucket management

- [x] **API Gateway Foundation**
  - Basic routing setup
  - Request forwarding to services
  - CORS configuration

### 🔄 Current Implementation Status

**Upload Service**:

- ✅ Chunk-based file uploads
- ✅ Resumable upload support
- ✅ File validation and assembly
- ✅ Queue job creation for processing
- ✅ Worker process for MinIO upload

**Queue System**:

- ✅ Redis connection and configuration
- ✅ BullMQ job queue implementation
- ✅ Background worker processes
- ✅ Error handling and job retry logic

**Storage Layer**:

- ✅ MinIO integration
- ✅ Object storage operations
- ✅ File cleanup and management

## 🎯 Next Development Phase

### Phase 1: Complete Upload Pipeline

- [ ] **Enhanced Upload Service**

  - [ ] File type validation and security checks
  - [ ] Virus scanning integration
  - [ ] Upload progress tracking
  - [ ] Duplicate file detection

- [ ] **Storage Service Development**
  - [ ] RESTful API for file operations
  - [ ] File metadata storage
  - [ ] File versioning system
  - [ ] Access control and permissions

### Phase 2: Video Transcoding System

- [ ] **Transcode Service Implementation**

  - [ ] FFmpeg integration for video processing
  - [ ] HLS segmentation and playlist generation
  - [ ] Multiple resolution support (720p, 1080p, 4K)
  - [ ] Progress tracking and status updates

- [ ] **Queue Enhancement**
  - [ ] Priority-based job processing
  - [ ] Job retry mechanisms
  - [ ] Dead letter queue handling
  - [ ] Queue monitoring and metrics

### Phase 3: Streaming Infrastructure

- [ ] **Streaming Service Development**

  - [ ] HLS manifest serving
  - [ ] Adaptive bitrate streaming
  - [ ] CDN-like caching mechanisms
  - [ ] Stream analytics and monitoring

- [ ] **API Gateway Enhancement**
  - [ ] Authentication and authorization
  - [ ] Rate limiting and throttling
  - [ ] Request/response transformation
  - [ ] Load balancing between services

### Phase 4: Advanced Features

- [ ] **Monitoring and Observability**

  - [ ] Logging aggregation
  - [ ] Metrics collection (Prometheus)
  - [ ] Health checks and service discovery
  - [ ] Distributed tracing

- [ ] **Performance Optimization**
  - [ ] Connection pooling
  - [ ] Caching strategies
  - [ ] Database optimization
  - [ ] Memory management

## 🔧 Development Setup

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Git

### Getting Started

```bash
# Clone the repository
git clone <repository-url>
cd video-streaming-platform

# Start all services
docker-compose up

# Follow specific service logs
docker-compose logs -f upload-service
```

### Service Endpoints

- **API Gateway**: http://localhost:3000
- **Upload Service**: http://localhost:3001
- **Redis Dashboard**: http://localhost:8001
- **MinIO Console**: http://localhost:9001

## 📊 practicing Objectives

This project demonstrates:

1. **Microservices Patterns**: Service decomposition, inter-service communication
2. **Scalable Architecture**: Horizontal scaling, load distribution
3. **Message Queues**: Asynchronous processing, job queues
4. **File Handling**: Large file uploads, streaming, chunked processing
5. **Video Processing**: Transcoding, format conversion, streaming protocols
6. **DevOps Practices**: Containerization, orchestration, monitoring

## 🎓 Educational Value

### System Design Concepts

- **Separation of Concerns**: Each service has a single responsibility
- **Scalability**: Services can be scaled independently
- **Fault Tolerance**: Failure in one service doesn't affect others
- **Data Consistency**: Eventual consistency patterns with queues

### Node.js Advanced Topics

- **Worker Threads**: CPU-intensive tasks handling
- **Streams**: Efficient large file processing
- **Event-Driven Architecture**: Microservice communication
- **Memory Management**: Handling large video files

### Production Readiness

- **Error Handling**: Comprehensive error management
- **Logging**: Structured logging across services
- **Monitoring**: Health checks and metrics
- **Testing**: Unit and integration testing strategies

---

_This project serves as a comprehensive practicing platform for understanding how senior engineers approach system design, implement scalable architectures, and handle complex distributed systems challenges._
