rsync -r ./build/contracts/ ./ipfs_host
rsync -r ./public ./ipfs_host
rsync -r ./src ./ipfs_host

chmod +x ./ipfs_sync.sh