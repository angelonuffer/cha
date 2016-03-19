#! /bin/bash

mkdir -p /srv/tiva/{static/cha,apps/cha} /usr/share/tiva/cha /var/lib/cha
touch /var/lib/cha/chosed.txt
chown tivaweb /var/lib/cha/chosed.txt
cp ./static/* /srv/tiva/static/cha/
cp ./apps/* /srv/tiva/apps/cha/
cp ./share/* /usr/share/tiva/cha/
convert /srv/tiva/static/cha/fita.svg /srv/tiva/static/cha/fita.png
convert /srv/tiva/static/cha/fita_larga.svg /srv/tiva/static/cha/fita_larga.png
