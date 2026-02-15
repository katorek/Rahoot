import { QuizzWithId } from "@rahoot/common/types/game"
import fs from "fs"
import { resolve } from "path"

const inContainerPath = process.env.CONFIG_PATH

const getPath = (path: string = "") =>
  inContainerPath
    ? resolve(inContainerPath, path)
    : resolve(process.cwd(), "../../config", path)

class Config {
  static init() {
    const isConfigFolderExists = fs.existsSync(getPath())

    if (!isConfigFolderExists) {
      fs.mkdirSync(getPath())
    }

    const isGameConfigExists = fs.existsSync(getPath("game.json"))

    if (!isGameConfigExists) {
      fs.writeFileSync(
        getPath("game.json"),
        JSON.stringify(
          {
            managerPassword: "PASSWORD",
            music: true,
          },
          null,
          2
        )
      )
    }

    const isQuizzExists = fs.existsSync(getPath("quizz"))

    if (!isQuizzExists) {
      fs.mkdirSync(getPath("quizz"))

      fs.writeFileSync(
        getPath("quizz/example.json"),
        JSON.stringify(
          {
            subject: "Example Quizz",
            questions: [
              {
                question: "What is good answer ?",
                answers: ["No", "Good answer", "No", "No"],
                solution: 1,
                cooldown: 5,
                time: 15,
              },
              {
                question: "What is good answer with image ?",
                answers: ["No", "No", "No", "Good answer"],
                image: "https://placehold.co/600x400.png",
                solution: 3,
                cooldown: 5,
                time: 20,
              },
              {
                question: "What is good answer with two answers ?",
                answers: ["Good answer", "No"],
                image: "https://placehold.co/600x400.png",
                solution: 0,
                cooldown: 5,
                time: 20,
              },
            ],
          },
          null,
          2
        )
      )
    }
  }

  static game() {
    const isExists = fs.existsSync(getPath("game.json"))

    if (!isExists) {
      throw new Error("Game config not found")
    }

    try {
      const config = fs.readFileSync(getPath("game.json"), "utf-8")

      return JSON.parse(config)
    } catch (error) {
      console.error("Failed to read game config:", error)
    }

    return {}
  }


  static removeQuizz(fileName: string) {
    const quizzFilePath = getPath(`quizz/${fileName}`)

    if (!fs.existsSync(quizzFilePath)) {
      throw new Error(`Quizz file "${fileName}" not found`)
    }

    try {
      // Create backup directory if it doesn't exist
      const backupDir = getPath("quiz_removed")
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir)
      }

      // Create backup with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
      const backupFileName = `${fileName.replace(".json", "")}_${timestamp}.json`
      const backupFilePath = getPath(`backup/${backupFileName}`)

      // Copy file to backup
      fs.copyFileSync(quizzFilePath, backupFilePath)

      // Delete original file
      fs.unlinkSync(quizzFilePath)
      return true
    } catch (error) {
      console.error("Failed to remove quizz:", error)
      throw error
    }
  }

  static saveQuizz(json: string, fileName: string) {
    const isExists = fs.existsSync(getPath("quizz"))
    if (!isExists) {
      fs.mkdirSync(getPath("quizz"))
    }

    const filePath = getPath(`quizz/${fileName}`)

    let parsed: unknown
    try {
      parsed = JSON.parse(json)
    } catch {
      throw new Error("Invalid JSON provided to saveQuizz")
    }

    fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2), "utf-8")

    return true
  }
  
  static quizz() {
    const isExists = fs.existsSync(getPath("quizz"))

    if (!isExists) {
      return []
    }

    try {
      const files = fs
        .readdirSync(getPath("quizz"))
        .filter((file) => file.endsWith(".json"))

      const quizz: QuizzWithId[] = files.map((file) => {
        const data = fs.readFileSync(getPath(`quizz/${file}`), "utf-8")
        const config = JSON.parse(data)

        const id = file.replace(".json", "")

        return {
          id,
          ...config,
        }
      })

      return quizz || []
    } catch (error) {
      console.error("Failed to read quizz config:", error)

      return []
    }
  }
  
  static newQuizz(quizz: QuizzWithId) {
    const isExists = fs.existsSync(getPath("quizz"))

    if (!isExists) {
      fs.mkdirSync(getPath("quizz"))
    }

    const quizzFilePath = getPath(`quizz/${quizz.id}.json`)

    if (fs.existsSync(quizzFilePath)) {
      throw new Error(`Quizz with id "${quizz.id}" already exists`)
    }

    try {
      const {id, ...quizzData} = quizz

      fs.writeFileSync(
          quizzFilePath,
          JSON.stringify(quizzData, null, 2)
      )

      return true
    } catch (error) {
      console.error("Failed to create new quizz:", error)
      throw error
    }
  }
}

export default Config
