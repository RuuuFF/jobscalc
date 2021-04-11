const Job = require('../model/Job')
const Profile = require('../model/Profile')
const JobUtils = require('../utils/JobUtils')

module.exports = {
  index(req, res) {
    const jobs = Job.get()
    const profile = Profile.get()

    let statusCount = {
      total: jobs.length,
      progress: 0,
      done: 0,
    }

    // Total de horas por dia de cada job em progresso
    let jobTotalHours = 0
  
    const updatedJobs = jobs.map((job) => {
      // Ajustes no job
      const remaining = JobUtils.remainingDays(job)
      const status = remaining <= 0 ? 'done' : 'progress'

      // Somando a quantidade de status
      statusCount[status] += 1

      // Total de horas por dia de cada job em progresso
      jobTotalHours = status == 'progress' ? jobTotalHours += Number(job['daily-hours']) : jobTotalHours
    
      return {
        ...job,
        remaining,
        status,
        budget: JobUtils.calculateBudget(job, profile["value-hour"])
      }
    })

    // Calculo das horas livres por dia
    // Quantidade de horas que quero trabalhar (profile)
    // MENOS
    // Quantidade de horas/dia de cada job em progress 
    const freeHours = profile["hours-per-day"] - jobTotalHours

    return res.render("index", {
      jobs: updatedJobs,
      profile,
      statusCount,
      freeHours
    })
  }
}