# DevOps

## Setting up Ubuntu boxes

### Securing Ubuntu boxes

- [Securing SSH access](https://www.digitalocean.com/community/tutorials/how-to-configure-ssh-key-based-authentication-on-a-linux-server) by using SSH keys and disabling password authentication

### Installing Docker Engine

- Install [Docker Engine](https://docs.docker.com/engine/installation) on Ubuntu box
- Add user to [docker group](https://docs.docker.com/engine/install/linux-postinstall/) to avoid using sudo
- Login to Docker Hub and create a [access token](https://hub.docker.com/settings/security?generateToken=true)
- Login to Docker Hub using the access token on the Ubuntu box
```
docker login -u <username> -p <access_token>
```

### Installing dockerctl

```
sudo curl -sSL https://raw.githubusercontent.com/heyxyz/hey/main/script/clean >> /usr/local/bin/dockerctl
```
```
sudo chmod +x /usr/local/bin/dockerctl
```
- `dockerctl api` to start the API containers
- `dockerctl web` to start the Web containers
- `dockerctl og` to start the OG containers