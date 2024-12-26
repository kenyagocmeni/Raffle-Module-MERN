import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Çekiliş oluşturma
export const createRaffle = createAsyncThunk(
  "raffle/createRaffle",
  async (data, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/raffles`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Çekiliş oluşturulamadı.");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || "Bilinmeyen bir hata oluştu.");
    }
  }
);

// Çekilişi Güncelleme
export const updateRaffle = createAsyncThunk(
    'raffle/updateRaffle',
    async ({ id, ...data }, { rejectWithValue }) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/raffles/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error('Çekiliş güncellenemedi.');
        }
        return await response.json();
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

// Çekilişi Silme
export const deleteRaffle = createAsyncThunk(
  "raffle/deleteRaffle",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/raffles/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Çekiliş silinemedi.");
      }
      return id; // Sadece silinen çekilişin ID'sini döndürüyoruz
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Çekilişi sonlandırma
export const endRaffle = createAsyncThunk(
  "raffle/endRaffle",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/raffles/${id}/draw`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Çekilişi sonlandırma başarısız oldu."
        );
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || "Bilinmeyen bir hata oluştu.");
    }
  }
);

// Çekiliş kazananlarını görme
export const fetchWinners = createAsyncThunk(
  "raffle/fetchWinners",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/raffles/${id}/winners`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Kazananlar getirilemedi.");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || "Bilinmeyen bir hata oluştu.");
    }
  }
);

// Çekiliş detaylarını getirme
export const fetchRaffleDetails = createAsyncThunk(
  "raffle/fetchRaffleDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/raffles/${id}`
      );
      if (!response.ok) {
        throw new Error("Çekiliş detayları alınamadı.");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Çekiliş listeleme
export const fetchRaffles = createAsyncThunk(
  "raffle/fetchRaffles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/raffles`
      );
      if (!response.ok) {
        throw new Error("Çekilişler alınamadı.");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Çekilişi Geri Alma
export const resetRaffle = createAsyncThunk(
    'raffle/resetRaffle',
    async (id, { rejectWithValue }) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/raffles/${id}/reset`, {
          method: 'POST',
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Çekilişi sıfırlama başarısız oldu.');
        }
        return await response.json();
      } catch (error) {
        return rejectWithValue(error.message || 'Bilinmeyen bir hata oluştu.');
      }
    }
);

// Çekilişe katılım thunk'ı
export const participateInRaffle = createAsyncThunk(
    'raffle/participateInRaffle',
    async (data, { rejectWithValue }) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/participants/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Katılım başarısız oldu.');
        }
  
        return await response.json();
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
);

// Vazgeçilen ödülü sahiplendirme:
export const reassignWinner = createAsyncThunk(
    "raffle/reassignWinner",
    async ({ id, categoryName, prizeId }, { rejectWithValue }) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/raffles/${id}/categories/${categoryName}/prizes/${prizeId}/reassign`,
          {
            method: "POST",
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Talihli yeniden atanamadı.");
        }
        return await response.json();
      } catch (error) {
        return rejectWithValue(error.message || "Bilinmeyen bir hata oluştu.");
      }
    }
);

const raffleSlice = createSlice({
  name: "raffle",
  initialState: {
    raffles: [],
    raffleDetails: null, // Yeni state: Çekiliş detayları
    winners: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Çekiliş oluşturma
    builder
      .addCase(createRaffle.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createRaffle.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Çekiliş başarıyla oluşturuldu!";
        state.raffles.push(action.payload.raffle);
      })
      .addCase(createRaffle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  // Çekilişi sonlandırma
  builder
    .addCase(endRaffle.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    })
    .addCase(endRaffle.fulfilled, (state, action) => {
      state.loading = false;
      state.successMessage = action.payload.message;
    })
    .addCase(endRaffle.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Çekiliş kazananlarını görme
    builder
      .addCase(fetchWinners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWinners.fulfilled, (state, action) => {
        state.loading = false;
        state.winners = action.payload.winners;
      })
      .addCase(fetchWinners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Çekiliş listeleme
    builder
      .addCase(fetchRaffles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRaffles.fulfilled, (state, action) => {
        state.loading = false;
        state.raffles = action.payload;
      })
      .addCase(fetchRaffles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Çekilişi Güncelleme
    builder
      .addCase(updateRaffle.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateRaffle.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.raffles.findIndex(
          (raffle) => raffle._id === action.payload.raffle._id
        );
        if (index !== -1) {
          state.raffles[index] = action.payload.raffle;
        }
        state.successMessage = action.payload.message;
      })
      .addCase(updateRaffle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

      builder
      // Çekilişi sıfırlama
      .addCase(resetRaffle.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetRaffle.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        const updatedRaffle = action.payload.raffle;
        state.raffles = state.raffles.map((raffle) =>
          raffle._id === updatedRaffle._id ? updatedRaffle : raffle
        );
      })
      .addCase(resetRaffle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Çekilişi Silme
    builder
      .addCase(deleteRaffle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRaffle.fulfilled, (state, action) => {
        state.loading = false;
        state.raffles = state.raffles.filter(
          (raffle) => raffle._id !== action.payload
        );
        state.successMessage = "Çekiliş başarıyla silindi.";
      })
      .addCase(deleteRaffle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Çekiliş detaylarını getirme
    builder
      .addCase(fetchRaffleDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.raffleDetails = null;
      })
      .addCase(fetchRaffleDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.raffleDetails = action.payload;
      })
      .addCase(fetchRaffleDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

      //Çekilişe katılma:
      builder
      .addCase(participateInRaffle.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(participateInRaffle.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(participateInRaffle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Bir hata oluştu.';
      });
      builder
  .addCase(reassignWinner.pending, (state) => {
    state.loading = true;
    state.error = null;
    state.successMessage = null;
  })
  .addCase(reassignWinner.fulfilled, (state, action) => {
    state.loading = false;
    state.successMessage = action.payload.message;

    // Raffle detaylarını güncelle
    const updatedRaffle = action.payload.raffle;
    if (state.raffleDetails && state.raffleDetails._id === updatedRaffle._id) {
      state.raffleDetails = updatedRaffle;
    }
  })
  .addCase(reassignWinner.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });
  },
});

export const { clearMessages } = raffleSlice.actions;

export default raffleSlice.reducer;
