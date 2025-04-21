        const tx = document.querySelector('#tx')
        const button = document.querySelector('.wraper button')
        const text = document.querySelector('.text')
        const time = document.querySelector('.time')
        const list = document.querySelector('.list')
        const total = document.querySelector('.total')

        function fabu() {
            if (tx.value.trim() === '') {
                tx.value = ''
                total.innerHTML = '0/200字'
                alert('请勿发送空白评论！')
                return
            }
 

            const div = document.createElement('div')
 

            div.className = 'item'
            div.innerHTML = `
            <i class="avatar"></i>
            <div class="info">
                <p class="name">早八睡不醒午觉睡不够的程序员</p>
                <p class="text">${tx.value}</p>
                <p class="time">${new Date().toLocaleString()}</p>
            </div>
            `
 
            tx.value = ''
            total.innerHTML = `${tx.value.length}/200字`
 
  
            list.append(div)
        }
 

        button.addEventListener('click', () => {
            fabu()
        })
 

        tx.addEventListener('keyup', e => {
            if (e.key === 'Enter') fabu()
        })
 

        tx.addEventListener('focus', function () {
            total.style.opacity = 1
        })
 

        tx.addEventListener('blur', function () {
            total.style.opacity = 0
        })
 

        tx.addEventListener('input', () => {
            total.innerHTML = `${tx.value.length}/200字`
        })
 

 