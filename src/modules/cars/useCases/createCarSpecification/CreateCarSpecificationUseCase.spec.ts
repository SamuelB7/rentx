import { AppError } from "../../../../shared/errors/AppError"
import { CarsRepositoryInMemory } from "../../repositories/in-memory/CarsRepositoryInMemory"
import { SpecificationRepositoryInMemory } from "../../repositories/in-memory/SpecificationRepositoryInMemory"
import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase"

let createCarSpecificationUseCase: CreateCarSpecificationUseCase
let carsRepositoryInMemory: CarsRepositoryInMemory
let specificationsRepositoryInMemory: SpecificationRepositoryInMemory

describe("Create Car Specification", () => {
    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory()
        specificationsRepositoryInMemory = new SpecificationRepositoryInMemory()
        createCarSpecificationUseCase = new CreateCarSpecificationUseCase(carsRepositoryInMemory, specificationsRepositoryInMemory)
    })

    it("should not be able to add a new specification to a non-existent car", async () => {
        expect(async () => {
            const car_id = "1234"
            const specifications_id = ["54321"]

            await createCarSpecificationUseCase.execute({car_id, specifications_id})
        }).rejects.toBeInstanceOf(AppError)
    })

    it("should be able to add a new specification to the car", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Car1",
            description: "Car Description",
            daily_rate: 70,
            license_plate: "ABC-1234",
            fine_amount: 100,
            brand: "Car Brand",
            category_id: "4beb5878-324f-495e-8234-a1b8a477365a"
        })

        const specification = await specificationsRepositoryInMemory.create({
            description: "test",
            name: "test"
        })

        const specifications_id = [specification.id]

        const specificationsCars = await createCarSpecificationUseCase.execute({car_id: car.id, specifications_id})

        expect(specificationsCars).toHaveProperty("specifications")
        expect(specificationsCars.specifications.length).toBe(1)
    })
})