# DevOps

## Setting up Ubuntu boxes

- Install [Docker Engine](https://docs.docker.com/engine/installation) on Ubuntu box
- Add user to [docker group](https://docs.docker.com/engine/install/linux-postinstall/) to avoid using sudo

- [Securing SSH access](https://www.digitalocean.com/community/tutorials/how-to-configure-ssh-key-based-authentication-on-a-linux-server) by using SSH keys and disabling password authentication

- Login to Docker Hub and create a [access token](https://hub.docker.com/settings/security?generateToken=true)

- Login to Docker Hub using the access token on the Ubuntu box
```
docker login -u <username> -p <access_token>
```

- Add the environment variables to the GitHub secrets

