<!DOCTYPE html>
<html>
    <head>
        <style>
            td {
                text-align: left;
                padding: 0.5rem;
                font-size: 1.05rem;
                font-weight: 400;
            }

            .property{
                font-weight: 700;
                text-transform: uppercase;
            }
        </style>
    </head>
    <body>
        <div>
            <h1>
                Olá! Você recebeu um novo lead
            </h1>
            <table>
                <thead colspan='2'>
                    <tr>
                        <td>
                            <h2>
                                Dados do lead
                            </h2>
                        </td>
                    </tr>
                </thead>
                <tbody>
                @foreach ($lead as $property => $value)
                    <tr>
                        <td class="property">{{ $property }}</td>
                        <td>{{ $value}}</td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        </div>
    </body>
</html>