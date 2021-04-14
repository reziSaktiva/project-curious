const { UserInputError } = require('apollo-server-express')
const { db } = require('./admin')

module.exports = async (username, postId) => {
    const benda = ['kuda', 'gelas', 'televisi', 'motor', 'pohon']
    const warna = [
        {
            namaWarna: 'biru',
            kode: '#150485'
        },
        {
            namaWarna: 'merah',
            kode: '#a20a0a'
        },
        {
            namaWarna: 'kuning',
            kode: '#fecd1a'
        },
        {
            namaWarna: 'hijau',
            kode: '#cad315'
        },
        {
            namaWarna: 'hitam',
            kode: '#373a40'
        }
    ]
    const ajektif = ['jelek', 'bagus', 'cantik', "rusak", 'super']

    const randomNumber = Math.floor(Math.random() * 5)

    const bendaRandom = benda[randomNumber]
    const warnaRandom = warna[randomNumber]

    const randomNama = `${bendaRandom} ${warnaRandom.namaWarna} ${ajektif[randomNumber]}`

    const postDocument = db.doc(`/posts/${postId}`)
    const randomNameCollection = db.collection(`/posts/${postId}/randomizedData`)
    const randomNameData = {
        displayName: '',
        owner: username
    }
    try {
        let name;
        let displayImage;
        let colorCode;

        await randomNameCollection.where('owner', '==', username).limit(1).get()
            .then(data => {
                if (data.empty) {
                    return postDocument.get()
                        .then(doc => {
                            if(!doc.exists){
                                throw new UserInputError('Postingan tidak ditemukan/sudah dihapus')
                            } else {
                                if (username === doc.data().owner) {
                                    randomNameData.displayName = 'Author'
                                    randomNameData.colorCode = '#fff'
                                    randomNameData.displayImage = `https://firebasestorage.googleapis.com/v0/b/insvire-curious-app12.appspot.com/o/Display%20Image%2Fauthor.png?alt=media`
                                } else {
                                    randomNameData.displayName = randomNama
                                    randomNameData.colorCode = warnaRandom.kode
                                    randomNameData.displayImage = `https://firebasestorage.googleapis.com/v0/b/insvire-curious-app12.appspot.com/o/Display%20Image%2F${bendaRandom}.png?alt=media`
                                }
                                return randomNameCollection.add(randomNameData)
                            }
                        })
                        .then(data => {
                            name = randomNameData.displayName
                            displayImage = randomNameData.displayImage
                            colorCode = randomNameData.colorCode
                            data.update({ id: data.id })
                        })
                } else {
                    name = data.docs[0].data().displayName
                    displayImage = data.docs[0].data().displayImage
                    colorCode = data.docs[0].data().colorCode
                }
            })
        return { name, displayImage, colorCode }
    }
    catch (err) {
        console.log(err);
        throw new Error(err)
    }
}