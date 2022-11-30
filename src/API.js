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
        }
    }
}
