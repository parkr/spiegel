# Spiegel

Mirror your GitHub repos on a separate server. WebHook and Cron.

Every time a user pushes to your repo, it's cloned down to `~/reponame` and a
tar is made of it with the name `reponame-revision.tar.gz`. With the proper
configs, it's pushed up to Amazon S3.

## Installation

```bash
# on your server
~$ git clone git://github.com/parkr/spiegel.git && cd spiegel
~/spiegel$ # edit config.sh with your GitHub info
~/spiegel$ bash init.sh
~/spiegel$ bash sync.sh
```

If you want to use the webserver, setup node and make sure port 8080 is open on
your server.

## Mirroring

### Cron

Add a call to `sync.sh` to your `crontab` (usually by running `crontab -e`).

### WebHook

Copy `webhook/spiegel.conf` to `/etc/init/spiegel.conf` (it uses upstart on
ubuntu) and run `sudo start spiegel`. Then, add a webhook to your repos (under
Settings -> Service Hooks -> WebHook URLs) that points to your server on port
8080. Boom.

## Usage

Do whatever you like! I suggest using `rsync` for the dirs and `scp` for the
tar files. The idea is to have your code somewhere that will be available even
when GitHub goes offline.
