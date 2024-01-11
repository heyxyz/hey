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

### Installing deployctl

```
sudo curl -sSL https://raw.githubusercontent.com/heyxyz/hey/main/script/deployctl >> /usr/local/bin/deployctl
```
```
sudo chmod +x /usr/local/bin/deployctl
```
- `deployctl api` to restart the API containers with latest image
- `deployctl web` to restart the Web containers with latest image
- `deployctl og` to restart the OG containers with latest image