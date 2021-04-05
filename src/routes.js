const express = require('express')
const routes = express.Router()

const views = __dirname + "/views/"

const Profile = {
  data: {
    name: "Carlos Daniel",
    avatar: "https://github.com/ruuuff.png",
    "monthly-budget": 3000,
    "days-per-week": 5,
    "hours-per-day": 5,
    "vacation-per-year": 4,
    "value-hour": 75,
  },

  controllers: {
    index(req, res) {
      return res.render(views + 'profile', { profile: Profile.data })
    },

    update(req, res) {
      // req.body para pegar os dados
      const data = req.body

      // Definir quantas semanas tem um ano: 52
      const weeksPerYear = 52

      // Remover as semanas de férias do ano
      const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12

      // Quantas horas por semana estou trabalhando (horas trabalhando * dias na semana)
      const weekTotalHours = data["hours-per-day"] * data["days-per-week"] 

      // Total de horas trabalhadas no mês
      const monthlyTotalHours = weekTotalHours * weeksPerMonth

      // Valor da minha hora
      const valueHour = data["monthly-budget"] / monthlyTotalHours

      Profile.data = {
        ...Profile.data,
        ...req.body,
        "value-hour": valueHour,
      }

      return res.redirect('/profile')
    },
  }
}

const Job = {
  data: [
    {
      id: 1,
      name: "Pizzaria Guloso",
      "daily-hours": 2,
      "total-hours": 1,
      created_at: Date.now(),
    },
  
    {
      id: 2,
      name: "OneTwo Project",
      "daily-hours": 3,
      "total-hours": 47,
      created_at: Date.now(),
    }
  ],

  controllers: {
    index(req, res) {
      const updatedJobs = Job.data.map((job) => {
        // Ajustes no job
        const remaining = Job.services.remainingDays(job)
        const status = remaining <= 0 ? 'done' : 'progress'
      
        return {
          ...job,
          remaining,
          status,
          budget: Job.services.calculateBudget(job, Profile.data["value-hour"])
        }
      })
      return res.render(views + 'index', { jobs: updatedJobs })
    },

    create(req, res) {
      return res.render(views + 'job')
    },

    save(req, res) {
      // "?.id" procura por um número, se não tiver, ele utiliza o 1
      const lastId = Job.data[Job.data.length - 1]?.id || 0

      // Salva os itens do formulário na constante jobs (POST)
      Job.data.push({
        id: lastId + 1,
        name: req.body.name,
        "daily-hours": req.body["daily-hours"],
        "total-hours": req.body["total-hours"],

        // Atribui o tempo em milisegundos decorridos desde 1 de Janeiro de 1970
        created_at: Date.now(),
      })

      // Redirecionar o usuário a página inicial
      return res.redirect('/')
    },

    show(req, res) {
      const jobId = req.params.id

      const job = Job.data.find(job => Number(job.id) === Number(jobId))

      if (!job) {
        return res.send('Job not found!')
      }

      job.budget = Job.services.calculateBudget(job, Profile.data["value-hour"])

      return res.render(views + "job-edit", { job })
    },

    update(req, res) {
      const jobId = req.params.id

      const job = Job.data.find(job => Number(job.id) === Number(jobId))

      if (!job) {
        return res.send('Job not found!')
      }

      const updatedJob = {
        ...job,
        name: req.body.name,
        "total-hours": req.body["total-hours"],
        "daily-hours": req.body["daily-hours"]
      }

      Job.data = Job.data.map(job => {
        if(Number(job.id) === Number(jobId)) {
          job = updatedJob
        }

        return job
      })

      res.redirect('/job/' + jobId)
    },

    delete(req, res) {
      const jobId = req.params.id

      Job.data = Job.data.filter(job => Number(job.id) !== Number(jobId))

      return res.redirect('/')
    }
  },

  services: {
    remainingDays(job) {
      // Calculo de tempo restante (o total de horas por dia dividido pelas horas totais)
      // "".toFixed()" arredonda o número como Math.round()
      const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed()
        
      // Salva a data em que o Job foi criado
      const createdDate = new Date(job.created_at)
    
      // Pega a data criada e soma com os dias que faltam (dia do fim do praazo)
      const dueDay = createdDate.getDate() + Number(remainingDays)
    
      // Pega os dias que faltam para o fim do prazo
      const dueDateInMs = createdDate.setDate(dueDay)
        
      // Subtrai os dias para o fim do prazo baseado na data de hoje (em ms)
      const timeDiffInMs = dueDateInMs - Date.now()
    
      // Transformar "ms" em dias
      const dayInMs = 1000 * 60 * 60 * 24
    
      // Divide timeDiffInMs com dayInMs para obter os dias restantes
      const dayDiff = Math.floor(timeDiffInMs / dayInMs)
    
      return dayDiff
    },

    calculateBudget: (job, valueHour) => valueHour * job["total-hours"]
  },
}

// request, response
routes.get('/', Job.controllers.index)
routes.get('/job', Job.controllers.create)
routes.post('/job', Job.controllers.save)
routes.get('/job/:id', Job.controllers.show)
routes.post('/job/:id', Job.controllers.update)
routes.post('/job/delete/:id', Job.controllers.delete)
routes.get('/profile', Profile.controllers.index)
routes.post('/profile', Profile.controllers.update)

module.exports = routes