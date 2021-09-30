[![Contributors][contributors-shield]][contributors-url]
  [![Issues][issues-shield]][issues-url]
  [![MIT License][license-shield]][license-url]

<p align="center">
  <h3 align="center">Alya Recieve Only Node.js Mail Server</h3>
  <br/>
  


  <p align="center">
    Alya Recieve Only Node.js Mail Server (Node.js)[https://nodejs.org/en/]!
    <br />
    <a href="https://nodejs.org/en/"><strong>Explore the Node.js »</strong></a>
    <br />
    <br />
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#todo">TODO</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>

## About The Project

Mail servers are resource-consuming and complex services. If you have a small project and resources. You could not setup equipped with all the functions mail servers on small computers(Nearly all mail server solutions requires 2 GB RAM at least.). But at least there is a solution to listen all incoming mails by Node.js. In this project my ambitious is ensure recieve incoming mails and display it on the web page with basic auth.  

### Built With

- [Node.js](https://nodejs.org/en/) for SMTP Reciever and Web Displayer
- [Express](https://www.npmjs.com/package/express) for Display mails with http requests
- [smtp-server](https://www.npmjs.com/package/smtp-server) for handle SMTP requests
- [mailparser](https://www.npmjs.com/package/mailparser) for parse incoming mails
- [leveldb](https://www.npmjs.com/package/level) for save incoming mails to nosql local database

## Getting Started
### Prerequisites

- Docker (for build Docker-image *OPTIONAL)
  ```sh
  Install docker on your OS  
  https://docs.docker.com/get-docker/  
  ```

### Installation

1. Clone the repo:
   ```sh
   git clone https://github.com/AlperRehaYAZGAN/alya-receive-only-mail-server.git  
   cd alya-receive-only-mail-server
   ```
2. Build docker image:
   ```sh
   docker build -t alyamailserver:0.0.1 .
   ```
3. Run Docker container:
   ```sh
   docker run --name alya-mail-server \ 
   -e APP_URL=http://MYDOMAIN.COM \ 
   -e APP_PORT=9631 \ 
   -e MAIL_PORT=25 \ 
   -e USERNAME=mynameis \ 
   -e PASSWORD=supersecretpass \  
   -p 9631:9631 \  
   -p 25:25 \  
   -v /path/to/db/on/my/local:/home/node/app/data \  
   -d alyamailserver:0.0.1
   ```

## Usage

Mail server on port MAIL_PORT||25 handles whole incoming mail processes. By the web page side Express app APP_PORT||9631 is only responsible for displaying the data in pure text/plain form. Example requests below.

- GET /incomings/ : Retrieves all incoming mails date as ISOString 

```sh
   curl -X GET -G \  
   "http://localhost:9631/incomings/" \ 
   --user mynameis:supersecretpass  
   ```

- GET /incomings/2021-09-30T12:17:39.578Z : get mail content

```sh
   curl -X GET -G \  
   "http://localhost:9631/incomings/2021-09-30T12:17:39.578Z" \ 
   --user mynameis:supersecretpass  
   ```

- GET /errors/ : Retrieves all errors while handling incoming mails. Response returns errors occured dates as ISOString 

```sh
   curl -X GET -G \  
   "http://localhost:9631/errors/" \ 
   --user mynameis:supersecretpass  
   ```

- GET /errors/2021-09-30T12:17:39.578Z : get error details

```sh
   curl -X GET -G \  
   "http://localhost:9631/errors/2021-09-30T12:17:39.578Z" \ 
   --user mynameis:supersecretpass  
   ```


## Roadmap

See the [open issues](https://github.com/AlperRehaYAZGAN/alya-receive-only-mail-server/issues) for a list of proposed features (and known issues).

## TODO  
- [X] Recieve and display mails  
- [-] Improve UI with Panel
- [-] Create Accounting to See related mails  

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Alper Reha YAZGAN - [@alperreha](https://twitter.com/alperreha) - alper@yazgan.xyz

Project Link: [https://github.com/AlperRehaYAZGAN/alya-receive-only-mail-server](https://github.com/AlperRehaYAZGAN/alya-receive-only-mail-server)


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/AlperRehaYAZGAN/alya-receive-only-mail-server.svg?style=for-the-badge
[contributors-url]: https://github.com/AlperRehaYAZGAN/alya-receive-only-mail-server/graphs/contributors
[issues-shield]: https://img.shields.io/github/issues/AlperRehaYAZGAN/alya-receive-only-mail-server.svg?style=for-the-badge
[issues-url]: https://github.com/AlperRehaYAZGAN/alya-receive-only-mail-server/issues
[license-shield]: https://img.shields.io/github/license/AlperRehaYAZGAN/alya-receive-only-mail-server.svg?style=for-the-badge
[license-url]: https://github.com/AlperRehaYAZGAN/alya-receive-only-mail-server/blob/master/LICENSE.txt
