#
# Spiegel
# Author: Parker Moore
# Repo:   github.com/parkr/spiegel
#

export DEBIAN_FRONTEND=noninteractive
sudo apt-get update
sudo apt-get -q -y install python-software-properties python g++ make upstart rsync s3cmd
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get -q -y install nodejs
