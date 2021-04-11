module.exports =  {
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

  calculateBudget: (job, valueHour) => valueHour * job["total-hours"],
}