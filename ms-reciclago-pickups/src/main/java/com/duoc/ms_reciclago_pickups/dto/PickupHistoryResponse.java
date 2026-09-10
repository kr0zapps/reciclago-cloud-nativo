package com.duoc.ms_reciclago_pickups.dto;

import java.io.Serializable;
import java.util.List;

public class PickupHistoryResponse implements Serializable {

    private List<PickupHistoryDto> content;
    private long totalElements;
    private int totalPages;
    private int currentPage;

    public PickupHistoryResponse() {
    }

    public PickupHistoryResponse(List<PickupHistoryDto> content, long totalElements, int totalPages, int currentPage) {
        this.content = content;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
    }

    public List<PickupHistoryDto> getContent() {
        return content;
    }

    public void setContent(List<PickupHistoryDto> content) {
        this.content = content;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }
}
