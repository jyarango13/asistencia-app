USE  sistema_asistencia;
SELECT 
    -- Apellidos y Nombres
    p.apellidos AS "APELLIDOS",
    p.nombres AS "NOMBRES",
    r.nombre  AS "ROL",

    -- Entrada (hora) y Salida (hora)
    MAX(CASE WHEN ta.id = 'A001' THEN TIME(a.fecha_hora) END) AS "Entrada",
    MAX(CASE WHEN ta.id = 'A002' THEN TIME(a.fecha_hora) END) AS "Salida",

    -- Foto de salida (Evidencia de Asistencia)
    MAX(CASE WHEN ta.id = 'A001' THEN a.evidencia_asi END) AS "FotoIngreso",
    MAX(CASE WHEN ta.id = 'A002' THEN a.evidencia_asi END) AS "FotoSalida",


    
CASE 
    -- Si la hora de entrada es posterior a la hora de inicio permitida
    WHEN HOUR(MAX(CASE WHEN ta.id = 'A001' THEN a.fecha_hora END)) > HOUR(hp.hora_inicio) 
    OR (HOUR(MAX(CASE WHEN ta.id = 'A001' THEN a.fecha_hora END)) = HOUR(hp.hora_inicio) 
        AND MINUTE(MAX(CASE WHEN ta.id = 'A001' THEN a.fecha_hora END)) > MINUTE(hp.hora_inicio)) THEN
        TIMESTAMPDIFF(MINUTE, hp.hora_inicio, 
            MAX(CASE WHEN ta.id = 'A001' THEN a.fecha_hora END))
    ELSE 
        -- Si la hora de entrada es antes de la hora permitida, la tardanza es 0
        0
END AS "Tardanza",


    -- Extra (después de su salida)
    ABS(TIMESTAMPDIFF(MINUTE, 
        MAX(CASE WHEN ta.id = 'A002' THEN TIME(a.fecha_hora) END), hp.hora_fin)) AS "Extra",

    -- Extra en horas y minutos
    CONCAT(
        FLOOR(ABS(TIMESTAMPDIFF(MINUTE, 
            MAX(CASE WHEN ta.id = 'A002' THEN TIME(a.fecha_hora) END), hp.hora_fin)) / 60), 
        ' H ',
        MOD(ABS(TIMESTAMPDIFF(MINUTE, 
            MAX(CASE WHEN ta.id = 'A002' THEN TIME(a.fecha_hora) END), hp.hora_fin)), 60), 
        ' MIN'
    ) AS "Extra en Horas",
    

    -- Horario (tipo de horario)
    hp.hora_inicio AS "HoraInicio",
    hp.hora_fin AS "HoraFin"

FROM 
    personas p
JOIN 
	roles r ON p.rol_id = r.id
JOIN 
    asistencias a ON p.id = a.persona_id
JOIN 
    tipo_asistencia ta ON a.tipo_asistencia_id = ta.id
JOIN 
    horarios_permitidos hp ON p.rol_id = hp.rol_id

WHERE 
    DATE(a.fecha) = curdate() AND r.id IN ("R001","R003") -- valida que solo sea docente Tc y TP

GROUP BY 
    p.id, p.apellidos, p.nombres, hp.hora_inicio, hp.hora_fin

ORDER BY 
    p.apellidos, p.nombres;
