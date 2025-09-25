#!/bin/bash
mysql -uroot -prootpassword -e "GRANT ALL PRIVILEGES ON *.* TO 'sci'@'%'; FLUSH PRIVILEGES;"