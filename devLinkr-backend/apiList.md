# DevLinker APIs

## authRouter

- POST /signup
- POST /login
- POST /logout

## ProfileRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter

- POST /request/send/interested/:uId
- POST /request/send/ignored/:uId
- POST /request/send/accepted/:requestId
- POST /request/send/rejected/:requestId

## userRouter

- GET /user/connections
- GET /user/requests
- GET /user/feed

Status: ignored,interested,accepted,rejected
