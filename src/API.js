export default {
    v1: {
        employees: {
            getList: (page, size) => 'http://localhost:8030/v1/employee?page=' + page +'&size=' + size,
            getById: id => 'http://localhost:8030/v1/employee/' + id,
            create: 'http://localhost:8030/v1/employee',
            update: id => 'http://localhost:8030/v1/employee/' + id,
            delete: id => 'http://localhost:8030/v1/employee/' + id,
        },
        positions: {
            getList: (page, size) => 'http://localhost:8030/v1/position?page=' + page +'&size=' + size,
            create: 'http://localhost:8030/v1/position',
            update: id => 'http://localhost:8030/v1/position/' + id,
            delete: id => 'http://localhost:8030/v1/position/' + id,
        },
        grades: {
            getList: (page, size) => 'http://localhost:8030/v1/grade?page=' + page +'&size=' + size,
            create: 'http://localhost:8030/v1/grade',
            update: id => 'http://localhost:8030/v1/grade/' + id,
            delete: id => 'http://localhost:8030/v1/grade/' + id,
        },
        lessons: {
            getList: (page, size) => 'http://localhost:8030/v1/lesson?page=' + page +'&size=' + size,
            create: 'http://localhost:8030/v1/lesson',
            update: id => 'http://localhost:8030/v1/lesson/' + id,
            delete: id => 'http://localhost:8030/v1/lesson/' + id,
        }
    }
}
