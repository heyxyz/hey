const uploadToIPFS = async (data: any) => {
  const formData = new FormData()
  formData.append('file', JSON.stringify(data))
  try {
    const upload = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
      method: 'POST',
      body: formData
    })
    const { Hash }: { Hash: string } = await upload.json()

    return `https://ipfs.infura.io/ipfs/${Hash}`
  } catch (e) {
    console.log('IPFS Upload error: ', e)
  }
}

export default uploadToIPFS
