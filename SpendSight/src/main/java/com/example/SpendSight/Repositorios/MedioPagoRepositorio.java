package com.example.SpendSight.Repositorios;

import com.example.SpendSight.Modelos.MedioPago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedioPagoRepositorio extends JpaRepository<MedioPago, Integer> {
}